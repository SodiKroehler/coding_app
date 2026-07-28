#!/usr/bin/env python3
"""
Upload posts from a coding round and assign them to raters.

Usage:
    python scripts/upload_tweets.py round_2
    python scripts/upload_tweets.py round_2 --raters ARR159@pitt.edu sodikroehler@gmail.com
    python scripts/upload_tweets.py round_2 --dry-run

By default, tweets are assigned to ALL raters in the database.
Use --raters to restrict to specific emails.

CSVs are read from:
    scripts/<round_name>/*.csv

Expected columns (export format):
    sid, platform, source_id, source_url, author, created, text, title,
    subreddit, domain, post_type, created_year,
    political_leaning_qwen, conspiracy_qwen, explanation_qwen,
    prob_no_conspiracy, prob_conspiracy, political_leaning_label
    (plus other analysis columns — ignored unless listed below)
"""

import csv
import sys
import glob
import argparse
from datetime import datetime, timezone
from pathlib import Path

from _env import supabase_client

supabase = supabase_client()

# Path to coding_rounds folder relative to this script's location
SCRIPT_DIR = Path(__file__).resolve().parent
# CODING_ROUNDS_DIR = SCRIPT_DIR.parent.parent.parent / "local" / "coding_rounds"

CODING_ROUNDS_DIR = SCRIPT_DIR

ALLOWED_PLATFORMS = {"twitter", "bluesky", "reddit", "youtube", "tiktok"}

# Optional extras kept in tweets.metadata (not first-class columns)
METADATA_KEYS = (
    "subreddit",
    "title",
    "domain",
    "source_url",
    "post_type",
    "created_year",
)


def parse_posted_at(value: str) -> str | None:
    """Parse a Unix timestamp or ISO-like datetime into ISO 8601 UTC."""
    if not value or not value.strip():
        return None
    raw = value.strip()
    try:
        ts = float(raw)
        return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
    except ValueError:
        pass
    # e.g. "2020-04-04 13:52:05+00:00"
    try:
        dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except ValueError:
        return None


def parse_float(value: str) -> float | None:
    if not value or not str(value).strip():
        return None
    try:
        return float(str(value).strip())
    except ValueError:
        return None


def get_or_create_round(name: str) -> str:
    res = supabase.table("rounds").select("id").eq("name", name).maybe_single().execute()
    if res is not None and res.data:
        print(f"  Round '{name}' already exists → {res.data['id']}")
        return res.data["id"]
    res = supabase.table("rounds").insert({"name": name}).execute()
    rid = res.data[0]["id"]
    print(f"  Created round '{name}' → {rid}")
    return rid


def get_all_raters() -> list[dict]:
    res = supabase.table("raters").select("id, name, email").execute()
    return res.data or []


def get_raters_by_email(emails: list[str]) -> list[dict]:
    raters = []
    for email in emails:
        res = (
            supabase.table("raters")
            .select("id, name, email")
            .eq("email", email.strip().lower())
            .maybe_single()
            .execute()
        )
        if not res.data:
            print(f"  WARNING: No rater found for email '{email}' — skipping.", file=sys.stderr)
        else:
            raters.append(res.data)
    return raters


def parse_row(row: dict) -> dict | None:
    """Map CSV columns to our tweets schema. Returns None to skip."""
    tweet_id = row.get("sid", "").strip() or row.get("id", "").strip()
    if not tweet_id:
        return None

    # Content: prefer text → title; fall back to older Reddit export columns
    content = (
        row.get("text", "").strip()
        or row.get("title", "").strip()
        or row.get("clean_full", "").strip()
        or row.get("clean_text", "").strip()
        or row.get("selftext", "").strip()
    )
    if not content:
        return None

    platform = (row.get("platform", "") or "reddit").strip().lower()
    if platform not in ALLOWED_PLATFORMS:
        print(f"  WARNING: Unknown platform '{platform}' for {tweet_id} — defaulting to reddit.", file=sys.stderr)
        platform = "reddit"

    posted_at = parse_posted_at(row.get("created", "") or row.get("created_utc", ""))

    metadata: dict = {}
    for key in METADATA_KEYS:
        val = row.get(key, "").strip()
        if val:
            metadata[key] = val

    def opt(col: str) -> str | None:
        val = row.get(col, "").strip()
        return val or None

    return {
        "id": tweet_id,
        "platform": platform,
        "content": content,
        "author": row.get("author", "").strip() or None,
        "posted_at": posted_at,
        "political_leaning_qwen": opt("political_leaning_qwen"),
        "conspiracy_qwen": opt("conspiracy_qwen"),
        "explanation_qwen": opt("explanation_qwen"),
        "prob_no_conspiracy": parse_float(row.get("prob_no_conspiracy", "")),
        "prob_conspiracy": parse_float(row.get("prob_conspiracy", "")),
        "political_leaning_label": opt("political_leaning_label"),
        "metadata": metadata if metadata else None,
    }


def main(round_name: str, rater_emails: list[str] | None, dry_run: bool):
    round_dir = CODING_ROUNDS_DIR / round_name
    if not round_dir.is_dir():
        print(f"ERROR: Directory not found: {round_dir}", file=sys.stderr)
        sys.exit(1)

    csv_files = glob.glob(str(round_dir / "*.csv"))
    if not csv_files:
        print(f"ERROR: No CSV files found in {round_dir}", file=sys.stderr)
        sys.exit(1)

    print(f"Reading from: {round_dir}")
    print(f"CSV files: {[Path(f).name for f in csv_files]}")

    # Collect all tweet rows across CSV files
    tweets: dict[str, dict] = {}
    for csv_path in csv_files:
        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            skipped = 0
            for row in reader:
                parsed = parse_row(row)
                if parsed is None:
                    skipped += 1
                    continue
                tweets[parsed["id"]] = parsed  # deduplicate by id
            if skipped:
                print(f"  Skipped {skipped} row(s) with missing id or content in {Path(csv_path).name}")

    print(f"\nUnique posts: {len(tweets)}")

    # Resolve raters
    raters = get_raters_by_email(rater_emails) if rater_emails else get_all_raters()
    if not raters:
        print("ERROR: No raters found. Add raters to Supabase first.", file=sys.stderr)
        sys.exit(1)
    print(f"Raters: {[r['name'] for r in raters]}")

    if dry_run:
        print(f"\nDry run — would upsert {len(tweets)} post(s) and create {len(tweets) * len(raters)} assignment(s).")
        print("Sample post IDs:", list(tweets.keys())[:5])
        sample = next(iter(tweets.values()))
        print("Sample classifiers:", {
            "political_leaning_qwen": sample.get("political_leaning_qwen"),
            "conspiracy_qwen": sample.get("conspiracy_qwen"),
            "prob_no_conspiracy": sample.get("prob_no_conspiracy"),
            "prob_conspiracy": sample.get("prob_conspiracy"),
            "political_leaning_label": sample.get("political_leaning_label"),
            "explanation_qwen": (sample.get("explanation_qwen") or "")[:80],
        })
        return

    # Resolve or create round
    round_id = get_or_create_round(round_name)

    # Upsert tweets — update on conflict so re-runs fill/refresh classifier columns
    tweet_list = list(tweets.values())
    supabase.table("tweets").upsert(tweet_list, on_conflict="id").execute()
    print(f"Upserted {len(tweet_list)} post(s).")

    # Create assignments for every tweet × rater
    assignments = [
        {"tweet_id": tid, "rater_id": rater["id"], "round_id": round_id}
        for tid in tweets
        for rater in raters
    ]
    supabase.table("assignments").upsert(
        assignments,
        on_conflict="tweet_id,rater_id,round_id",
        ignore_duplicates=True,
    ).execute()
    print(f"Created {len(assignments)} assignment(s) ({len(tweets)} posts × {len(raters)} raters).")
    print("Done.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload a coding round to Supabase.")
    parser.add_argument("round_name", help="Round folder name, e.g. round_2")
    parser.add_argument(
        "--raters", nargs="+", metavar="EMAIL",
        help="Restrict to specific rater emails (default: all raters in DB)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing anything")
    args = parser.parse_args()
    main(args.round_name, args.raters, args.dry_run)

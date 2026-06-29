#!/usr/bin/env python3
"""
Upload Reddit posts from a coding round and assign them to raters.

Usage:
    python scripts/upload_tweets.py round_1
    python scripts/upload_tweets.py round_1 --raters ARR159@pitt.edu sodikroehler@gmail.com
    python scripts/upload_tweets.py round_1 --dry-run

By default, tweets are assigned to ALL raters in the database.
Use --raters to restrict to specific emails.

CSVs are read from:
    LEFT_CONSPIRACY/local/coding_rounds/<round_name>/*.csv

Expected columns (Reddit export format):
    id, author, created_utc, domain, num_comments, score,
    selftext, subreddit, subreddit_id, title, url,
    clean_text, clean_full, created_date, created_year
    (plus index columns Unnamed: 0, Unnamed: 0.1 — ignored)
"""

import csv
import os
import sys
import glob
import argparse
from datetime import datetime, timezone
from pathlib import Path

from _env import supabase_client

supabase = supabase_client()

# Path to coding_rounds folder relative to this script's location
SCRIPT_DIR = Path(__file__).resolve().parent
CODING_ROUNDS_DIR = SCRIPT_DIR.parent.parent.parent / "local" / "coding_rounds"


def utc_epoch_to_iso(value: str) -> str | None:
    """Convert a Unix timestamp (seconds) to ISO 8601 UTC string."""
    if not value or not value.strip():
        return None
    try:
        ts = float(value.strip())
        return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
    except (ValueError, OSError):
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
        res = supabase.table("raters").select("id, name, email").eq("email", email.strip().lower()).maybe_single().execute()
        if not res.data:
            print(f"  WARNING: No rater found for email '{email}' — skipping.", file=sys.stderr)
        else:
            raters.append(res.data)
    return raters


def parse_row(row: dict) -> dict | None:
    """Map Reddit CSV columns to our tweets schema. Returns None to skip."""
    tweet_id = row.get("id", "").strip()
    if not tweet_id:
        return None

    # Content: prefer clean_full → clean_text → selftext
    content = (
        row.get("clean_full", "").strip()
        or row.get("clean_text", "").strip()
        or row.get("selftext", "").strip()
    )
    if not content:
        return None

    posted_at = utc_epoch_to_iso(row.get("created_utc", ""))

    # Pack Reddit-specific fields into metadata
    metadata: dict = {}
    for key in ("subreddit", "subreddit_id", "num_comments", "score", "url", "title", "domain", "is_self", "created_year"):
        val = row.get(key, "").strip()
        if val:
            metadata[key] = val

    return {
        "id": tweet_id,
        "platform": "reddit",
        "content": content,
        "author": row.get("author", "").strip() or None,
        "posted_at": posted_at,
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
        return

    # Resolve or create round
    round_id = get_or_create_round(round_name)

    # Upsert tweets
    tweet_list = list(tweets.values())
    supabase.table("tweets").upsert(tweet_list, on_conflict="id", ignore_duplicates=True).execute()
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
    parser.add_argument("round_name", help="Round folder name, e.g. round_1")
    parser.add_argument(
        "--raters", nargs="+", metavar="EMAIL",
        help="Restrict to specific rater emails (default: all raters in DB)"
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing anything")
    args = parser.parse_args()
    main(args.round_name, args.raters, args.dry_run)

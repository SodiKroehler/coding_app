#!/usr/bin/env python3
"""
Export ratings as a long-format CSV.

Usage:
    python scripts/export_ratings.py                          # all rounds
    python scripts/export_ratings.py --round round1           # filter by round name
    python scripts/export_ratings.py --out ratings_r1.csv     # write to file instead of stdout

Each row = one completed rating (unique tweet × rater × round combination).
Label columns are flat (conspiracy_label, post_polarity_label, poster_polarity_label, …).
Add new label columns to LABEL_COLUMNS as dimensions grow.
"""

import csv
import sys
import argparse

from _env import supabase_client

supabase = supabase_client()

# Update this list when you add new label columns to the ratings table
LABEL_COLUMNS = ["conspiracy_label", "post_polarity_label", "poster_polarity_label"]

EXTRA_COLUMNS = [
    "stance",
    "actor",
    "actor_political_leaning",
    "actor_portrayal",
    "victim_political_leaning",
    "action",
    "target",
    "known_conspiracy",
    "known_conspiracy_other",
    "note",
]

FIELDNAMES = [
    "rating_id",
    "tweet_id",
    "platform",
    "content",
    "author",
    "posted_at",
    "rater_name",
    "rater_email",
    "round_name",
    "round_description",
    *LABEL_COLUMNS,
    *EXTRA_COLUMNS,
    "ct_leaning_actor_victim",
    "rated_at",
]


# Proxy 2 (actor lean x portrayal); mirrors lib/ctLeaning.ts
ACTOR_RULE = {
    ("left", "bad"): "right",
    ("left", "good"): "left",
    ("right", "bad"): "left",
    ("right", "good"): "right",
}


def ct_leaning(r: dict) -> str:
    """Actor/victim-based CT leaning: rule 2 (actor), else rule 3 (victim), else unclear."""
    by_actor = ACTOR_RULE.get((r.get("actor_political_leaning"), r.get("actor_portrayal")))
    if by_actor:
        return by_actor
    if r.get("victim_political_leaning") in ("left", "right"):
        return r["victim_political_leaning"]
    return "unclear"


def main(round_name: str | None, out_path: str | None):
    # Fetch all ratings, joined with tweets, raters, rounds
    label_select = ", ".join(f"ratings.{col}" for col in LABEL_COLUMNS)
    extra_select = ", ".join(f"ratings.{col}" for col in EXTRA_COLUMNS)
    query = (
        supabase.table("ratings")
        .select(
            f"id, tweet_id, rater_id, round_id, {label_select}, {extra_select}, created_at, "
            "tweets(id, platform, content, author, posted_at), "
            "raters(id, name, email), "
            "rounds(id, name, description)"
        )
        .order("created_at")
    )

    if round_name:
        # Need to join via round_id matching rounds.name — fetch round id first
        res = supabase.table("rounds").select("id").eq("name", round_name).single().execute()
        if not res.data:
            print(f"Round '{round_name}' not found.", file=sys.stderr)
            sys.exit(1)
        query = query.eq("round_id", res.data["id"])

    result = query.execute()
    ratings = result.data or []

    out = open(out_path, "w", newline="", encoding="utf-8") if out_path else sys.stdout
    writer = csv.DictWriter(out, fieldnames=FIELDNAMES)
    writer.writeheader()

    for r in ratings:
        tweet = r.get("tweets") or {}
        rater = r.get("raters") or {}
        round_ = r.get("rounds") or {}
        row = {
            "rating_id": r["id"],
            "tweet_id": r["tweet_id"],
            "platform": tweet.get("platform", ""),
            "content": tweet.get("content", ""),
            "author": tweet.get("author", ""),
            "posted_at": tweet.get("posted_at", ""),
            "rater_name": rater.get("name", ""),
            "rater_email": rater.get("email", ""),
            "round_name": round_.get("name", ""),
            "round_description": round_.get("description", ""),
            "rated_at": r["created_at"],
        }
        for col in LABEL_COLUMNS:
            row[col] = r.get(col, "")
        for col in EXTRA_COLUMNS:
            row[col] = r.get(col) or ""
        row["ct_leaning_actor_victim"] = ct_leaning(r)
        writer.writerow(row)

    if out_path:
        out.close()
        print(f"Exported {len(ratings)} rating(s) to {out_path}.")
    else:
        print(f"# Exported {len(ratings)} rating(s).", file=sys.stderr)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export ratings as long-format CSV.")
    parser.add_argument("--round", dest="round_name", default=None, help="Filter by round name")
    parser.add_argument("--out", dest="out_path", default=None, help="Output file path (default: stdout)")
    args = parser.parse_args()
    main(args.round_name, args.out_path)

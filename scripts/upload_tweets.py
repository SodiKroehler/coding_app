#!/usr/bin/env python3
"""
Upload tweets and create rater assignments.

Usage:
    python scripts/upload_tweets.py tweets.csv

CSV format (headers required):
    tweet_id, platform, content, author, posted_at, metadata_json, rater_email, round_name, round_description

- tweet_id: original platform post ID
- platform: twitter | bluesky | reddit | youtube | tiktok
- content: full post text
- author: handle or username (no @)
- posted_at: ISO 8601 datetime, e.g. 2024-03-15T10:30:00Z (optional, leave blank)
- metadata_json: JSON string with extra fields like {"likes": 42} (optional, leave blank)
- rater_email: email of the rater this tweet is assigned to
- round_name: e.g. "round1" — created automatically if it doesn't exist
- round_description: description of the round (only used on first creation of this round name)

Duplicate tweets are safely ignored (ON CONFLICT DO NOTHING).
Duplicate assignments are also safely ignored.
"""

import csv
import json
import os
import sys
from datetime import datetime

from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_or_create_round(name: str, description: str) -> str:
    res = supabase.table("rounds").select("id").eq("name", name).maybe_single().execute()
    if res.data:
        return res.data["id"]
    res = supabase.table("rounds").insert({"name": name, "description": description or None}).execute()
    return res.data[0]["id"]


def get_rater_id(email: str) -> str:
    res = supabase.table("raters").select("id").eq("email", email.strip().lower()).single().execute()
    if not res.data:
        raise ValueError(f"Rater not found for email: {email}. Add them in Supabase first.")
    return res.data["id"]


def main(csv_path: str):
    round_cache: dict[str, str] = {}
    rater_cache: dict[str, str] = {}

    tweets_to_upsert = []
    assignments_to_insert = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            tweet_id = row["tweet_id"].strip()
            platform = row["platform"].strip().lower()
            content = row["content"].strip()
            author = row.get("author", "").strip() or None
            posted_at = row.get("posted_at", "").strip() or None
            metadata_raw = row.get("metadata_json", "").strip()
            metadata = json.loads(metadata_raw) if metadata_raw else None
            rater_email = row["rater_email"].strip().lower()
            round_name = row["round_name"].strip()
            round_desc = row.get("round_description", "").strip() or None

            if not tweet_id or not platform or not content:
                print(f"Skipping row with missing required fields: {row}")
                continue

            tweets_to_upsert.append({
                "id": tweet_id,
                "platform": platform,
                "content": content,
                "author": author,
                "posted_at": posted_at,
                "metadata": metadata,
            })

            # Resolve round
            if round_name not in round_cache:
                round_cache[round_name] = get_or_create_round(round_name, round_desc or "")
                print(f"  Round '{round_name}' → {round_cache[round_name]}")

            # Resolve rater
            if rater_email not in rater_cache:
                rater_cache[rater_email] = get_rater_id(rater_email)
                print(f"  Rater '{rater_email}' → {rater_cache[rater_email]}")

            assignments_to_insert.append({
                "tweet_id": tweet_id,
                "rater_id": rater_cache[rater_email],
                "round_id": round_cache[round_name],
            })

    # Batch upsert tweets (deduplicated by tweet_id)
    unique_tweets = {t["id"]: t for t in tweets_to_upsert}.values()
    if unique_tweets:
        supabase.table("tweets").upsert(list(unique_tweets), on_conflict="id", ignore_duplicates=True).execute()
        print(f"Upserted {len(list(unique_tweets))} unique tweet(s).")

    # Insert assignments (ignore duplicates)
    if assignments_to_insert:
        supabase.table("assignments").upsert(
            assignments_to_insert,
            on_conflict="tweet_id,rater_id,round_id",
            ignore_duplicates=True
        ).execute()
        print(f"Inserted {len(assignments_to_insert)} assignment(s).")

    print("Done.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/upload_tweets.py <path/to/tweets.csv>")
        sys.exit(1)
    main(sys.argv[1])

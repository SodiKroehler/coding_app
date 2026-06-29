#!/usr/bin/env python3
"""
Add a codebook example.

Usage:
    python scripts/add_codebook_example.py \
        --code conspiracy \
        --tweet-id 12345 \
        --justification "Classic CT framing — alleges coordinated elite suppression" \
        --added-by "Smith & Jones (2022)"
"""

import os
import sys
import argparse

from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def main(code: str, tweet_id: str | None, justification: str, added_by: str):
    record = {
        "code": code,
        "tweet_id": tweet_id or None,
        "justification": justification,
        "added_by": added_by,
    }
    res = supabase.table("codebook_examples").insert(record).execute()
    print(f"Added example: {res.data[0]['id']}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--code", required=True, help="Dimension id: conspiracy | polarity")
    parser.add_argument("--tweet-id", default=None, help="Tweet ID (must already be in tweets table)")
    parser.add_argument("--justification", required=True)
    parser.add_argument("--added-by", required=True, help="Your name or citation")
    args = parser.parse_args()
    main(args.code, args.tweet_id, args.justification, args.added_by)

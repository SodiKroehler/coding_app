-- ============================================================
-- Rating App Schema
-- Run this in the Supabase SQL Editor to set up all tables
-- ============================================================

-- Rating rounds
CREATE TABLE rounds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Raters
CREATE TABLE raters (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  pin        TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Source posts
CREATE TABLE tweets (
  id         TEXT PRIMARY KEY,
  platform   TEXT NOT NULL CHECK (platform IN ('twitter','bluesky','reddit','youtube','tiktok')),
  content    TEXT NOT NULL,
  author     TEXT,
  posted_at  TIMESTAMPTZ,
  metadata   JSONB,
  added_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments: which rater should rate which tweet in which round
CREATE TABLE assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tweet_id    TEXT NOT NULL REFERENCES tweets(id),
  rater_id    UUID NOT NULL REFERENCES raters(id),
  round_id    UUID NOT NULL REFERENCES rounds(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tweet_id, rater_id, round_id)
);

-- Ratings: append-only, never updated
-- Flat label columns — add new ones with ALTER TABLE ADD COLUMN as dimensions grow
CREATE TABLE ratings (
  id                TEXT PRIMARY KEY,  -- {tweet_id}__{rater_id}__{round_id}
  tweet_id          TEXT NOT NULL REFERENCES tweets(id),
  rater_id          UUID NOT NULL REFERENCES raters(id),
  round_id          UUID NOT NULL REFERENCES rounds(id),
  conspiracy_label  TEXT CHECK (conspiracy_label IN ('CT','nonCT','unclear')),
  polarity_label    TEXT CHECK (polarity_label IN ('left','center','right','unclear')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tweet_id, rater_id, round_id)
);

-- Codebook examples
CREATE TABLE codebook_examples (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT NOT NULL,
  tweet_id      TEXT REFERENCES tweets(id),
  justification TEXT NOT NULL,
  added_by      TEXT NOT NULL,
  added_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Codebook notes (single freeform record — update in place via Supabase dashboard)
CREATE TABLE codebook_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content    TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- Enable RLS and allow all operations via service role key
-- (used by the Next.js API routes with the service key)
-- ============================================================

ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE raters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE codebook_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE codebook_notes ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
-- Grant anon read on codebook tables (public codebook page needs no auth)
CREATE POLICY "anon read codebook_examples" ON codebook_examples FOR SELECT TO anon USING (true);
CREATE POLICY "anon read codebook_notes" ON codebook_notes FOR SELECT TO anon USING (true);

-- All other access goes through service role (API routes)

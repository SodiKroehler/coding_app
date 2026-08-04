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
  id                      TEXT PRIMARY KEY,
  platform                TEXT NOT NULL CHECK (platform IN ('twitter','bluesky','reddit','youtube','tiktok')),
  content                 TEXT NOT NULL,
  author                  TEXT,
  posted_at               TIMESTAMPTZ,
  political_leaning_qwen  TEXT,
  conspiracy_qwen         TEXT,
  explanation_qwen        TEXT,
  prob_no_conspiracy      DOUBLE PRECISION,
  prob_conspiracy         DOUBLE PRECISION,
  political_leaning_label TEXT,
  metadata                JSONB,
  added_at                TIMESTAMPTZ DEFAULT NOW()
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
  id                      TEXT PRIMARY KEY,  -- {tweet_id}__{rater_id}__{round_id}
  tweet_id                TEXT NOT NULL REFERENCES tweets(id),
  rater_id                UUID NOT NULL REFERENCES raters(id),
  round_id                UUID NOT NULL REFERENCES rounds(id),
  conspiracy_label        TEXT CHECK (conspiracy_label IN ('CT','nonCT','unclear')),
  polarity_label          TEXT CHECK (polarity_label IN (
                            'leftward_progressives',
                            'loyal_liberals',
                            'left_out_left',
                            'order_and_opportunity_left',
                            'tuned_out_middle',
                            'pragmatic_and_polite_right',
                            'unconventional_right',
                            'faith_first_conservatives',
                            'no_apologies_right',
                            'unclear'
                          )),
  stance                  TEXT NOT NULL DEFAULT 'NEUTRAL',
  actor                   TEXT,
  action                  TEXT,
  target                  TEXT,
  known_conspiracy        TEXT,
  known_conspiracy_other  TEXT,
  note                    TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tweet_id, rater_id, round_id)
);

-- Known conspiracy dropdown options are static in the app
-- (lib/knownConspiracies.ts), not a DB table. Reference list:
--   Iran/Israel attack false flag for Epstein
--   Trump assassination attempt was staged
--   Trump Epstein child abuse (BlueAnon)
--   2024 election stolen from Harris
--   LA wildfires as gov/Israel inside job
--   Biden drugged before 2024 debate
--   JD Vance couch memoir claim
--   DC/Boulder attacks as false flags
--   Sascha Riley Trump abuse claims
--   Raisi crash as CIA/Mossad hit
--   Trump suppressing Epstein files
--   FBI Iran warning as war pretext
--   Vance and the Pope
--   Virginia Giuffre suicide narrative
--   Epstein eating children claims
-- Ratings may also store known_conspiracy = 'other' with free text in
-- known_conspiracy_other.

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

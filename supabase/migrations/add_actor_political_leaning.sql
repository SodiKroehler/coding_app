-- Optional political lean of the named conspiracy-template actor.
-- Run in Supabase SQL Editor

ALTER TABLE ratings
  ADD COLUMN IF NOT EXISTS actor_political_leaning TEXT
  CHECK (actor_political_leaning IN ('left', 'right', 'center', 'unclear'));

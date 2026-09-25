-- CT leaning proxies (working definition, Sep 2026 draft).
-- Run in Supabase SQL Editor BEFORE deploying the new app code
-- (the Explorer selects these columns by name).
-- Safe: adds nullable columns only; existing ratings are untouched.

-- Proxy 2: how the conspiring actor is portrayed
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS actor_portrayal TEXT;
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_actor_portrayal_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_actor_portrayal_check
  CHECK (actor_portrayal IS NULL OR actor_portrayal IN ('good', 'bad', 'unclear'));

-- Proxy 3: political leaning of the conspiracy's target / victim
-- (named victim_* because the existing `target` column holds the template's goal)
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS victim_political_leaning TEXT;
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_victim_political_leaning_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_victim_political_leaning_check
  CHECK (victim_political_leaning IS NULL OR victim_political_leaning IN ('left', 'right', 'unclear'));

-- post_polarity_label is unchanged in the DB (left/right/center/unclear still allowed);
-- the app just no longer offers 'unclear' as a button.

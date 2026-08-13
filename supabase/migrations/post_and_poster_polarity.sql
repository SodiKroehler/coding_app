-- Split polarity into post-level coarse lean vs Pew poster typology.
-- Safe: adds new column, renames existing, backfills only null post_polarity_label.
-- Run in Supabase SQL Editor AFTER deploying the new app code.

-- 1) Rename Pew typology column
ALTER TABLE ratings RENAME COLUMN polarity_label TO poster_polarity_label;

-- Rename check constraint if present (name may vary)
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_polarity_label_check;
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_poster_polarity_label_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_poster_polarity_label_check
  CHECK (poster_polarity_label IS NULL OR poster_polarity_label IN (
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
  ));

-- 2) New mandatory-at-UI coarse post polarity
ALTER TABLE ratings
  ADD COLUMN IF NOT EXISTS post_polarity_label TEXT;

ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_post_polarity_label_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_post_polarity_label_check
  CHECK (post_polarity_label IS NULL OR post_polarity_label IN ('left', 'right', 'center', 'unclear'));

-- 3) Allow Borderline on conspiracy classification
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_conspiracy_label_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_conspiracy_label_check
  CHECK (conspiracy_label IS NULL OR conspiracy_label IN ('CT', 'nonCT', 'unclear', 'borderline'));

-- 4) Backfill post_polarity_label from Pew poster typology (all rows — field is new)
UPDATE ratings
SET post_polarity_label = CASE poster_polarity_label
  WHEN 'leftward_progressives' THEN 'left'
  WHEN 'loyal_liberals' THEN 'left'
  WHEN 'left_out_left' THEN 'left'
  WHEN 'order_and_opportunity_left' THEN 'left'
  WHEN 'tuned_out_middle' THEN 'center'
  WHEN 'pragmatic_and_polite_right' THEN 'right'
  WHEN 'unconventional_right' THEN 'right'
  WHEN 'faith_first_conservatives' THEN 'right'
  WHEN 'no_apologies_right' THEN 'right'
  WHEN 'unclear' THEN 'unclear'
  WHEN 'left' THEN 'left'
  WHEN 'right' THEN 'right'
  WHEN 'center' THEN 'center'
  ELSE post_polarity_label
END
WHERE post_polarity_label IS NULL
  AND poster_polarity_label IS NOT NULL;

-- Preview / sanity
-- SELECT post_polarity_label, poster_polarity_label, COUNT(*) FROM ratings GROUP BY 1, 2 ORDER BY 1, 2;

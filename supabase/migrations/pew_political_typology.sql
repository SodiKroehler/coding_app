-- Replace left/center/right polarity labels with Pew 2026 typology groups.
-- Run in Supabase SQL Editor

-- Remap legacy values so the new CHECK constraint can be applied
UPDATE ratings
SET polarity_label = 'unclear'
WHERE polarity_label IN ('left', 'center', 'right');

ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_polarity_label_check;

ALTER TABLE ratings ADD CONSTRAINT ratings_polarity_label_check
  CHECK (polarity_label IN (
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

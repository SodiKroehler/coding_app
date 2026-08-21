ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_conspiracy_label_check;
ALTER TABLE ratings ADD CONSTRAINT ratings_conspiracy_label_check
  CHECK (conspiracy_label IS NULL OR conspiracy_label IN ('CT', 'nonCT', 'unclear', 'borderline', 'link_to_ct'));

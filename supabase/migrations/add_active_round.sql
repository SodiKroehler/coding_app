-- Add is_active to rounds
-- Run in Supabase SQL Editor

ALTER TABLE rounds ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT false;

-- Partial unique index: only one round may have is_active = true at a time
CREATE UNIQUE INDEX IF NOT EXISTS one_active_round ON rounds (is_active) WHERE is_active = true;

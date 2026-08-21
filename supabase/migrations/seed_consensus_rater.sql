-- CONSENSUS is a special rater used to store gold labels from team meetings.
-- Nobody logs in as this user (the app rejects this email/name at /api/login).
-- Do not create assignments for it — that would inflate Incomplete on Explorer.

INSERT INTO raters (id, name, email, pin)
VALUES (
  '00000000-0000-4000-a000-000000000001',
  'CONSENSUS',
  'consensus@internal.invalid',
  'not-a-login'
)
ON CONFLICT (email) DO NOTHING;

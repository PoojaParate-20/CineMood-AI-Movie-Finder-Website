/*
# Create watchlist table (per-device, no sign-in)

CineMood has no accounts. Each visitor's browser generates a random device ID
and sends it with every request, so each visitor only sees their own saved titles.

1. New Tables
- `watchlist`
  - `id` (uuid, primary key)
  - `device_id` (text, not null) - random ID generated in the visitor's browser
  - `title` (text, not null)
  - `kind` (text, not null) - either 'movie' or 'tv'
  - `year` (text, not null) - release year or year range
  - `created_at` (timestamptz) - when the title was saved

2. Security
- Row level security enabled on `watchlist`.
- Grants: SELECT, INSERT, DELETE to `anon` and `authenticated` (no UPDATE needed).
- Policies compare each row's `device_id` with the `x-device-id` request header.
  Rows from other devices are never returned, inserted, or deleted.

3. Important Notes
- 1. The device ID is not a password. It keeps visitors' lists apart from each other
     but is not a substitute for real sign-in.
- 2. A unique constraint prevents the same title being saved twice on one device.
*/

CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  title text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('movie', 'tv')),
  year text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT watchlist_device_title_key UNIQUE (device_id, title, kind)
);

CREATE INDEX IF NOT EXISTS watchlist_device_id_idx ON watchlist (device_id, created_at DESC);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON watchlist TO anon, authenticated;

DROP POLICY IF EXISTS "select_own_device_watchlist" ON watchlist;
CREATE POLICY "select_own_device_watchlist" ON watchlist FOR SELECT
  TO anon, authenticated
  USING (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'));

DROP POLICY IF EXISTS "insert_own_device_watchlist" ON watchlist;
CREATE POLICY "insert_own_device_watchlist" ON watchlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'));

DROP POLICY IF EXISTS "delete_own_device_watchlist" ON watchlist;
CREATE POLICY "delete_own_device_watchlist" ON watchlist FOR DELETE
  TO anon, authenticated
  USING (device_id = (current_setting('request.headers', true)::json ->> 'x-device-id'));

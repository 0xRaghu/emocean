-- Emocean D1 Schema
-- Stores anonymous developer embers (micro-messages)

CREATE TABLE IF NOT EXISTS embers (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  tag TEXT DEFAULT NULL,
  sender_hash TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_seed TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  location_label TEXT DEFAULT 'Somewhere on Earth',
  stokes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Index for fetching recent embers
CREATE INDEX IF NOT EXISTS idx_embers_created_at ON embers(created_at);

-- Index for excluding sender's own embers
CREATE INDEX IF NOT EXISTS idx_embers_sender_hash ON embers(sender_hash);

-- Persistent metrics (survives ember purges)
CREATE TABLE IF NOT EXISTS metrics (
  key TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);

-- Initialize metrics if not exists
INSERT OR IGNORE INTO metrics (key, value) VALUES
  ('total_embers', 0),
  ('total_stokes', 0),
  ('total_devs', 0),
  ('tag_win', 0),
  ('tag_struggle', 0),
  ('tag_idea', 0),
  ('tag_rant', 0),
  ('tag_gratitude', 0),
  ('tag_late-night', 0),
  ('tag_none', 0);

-- Track unique devs (sender hashes we've seen)
CREATE TABLE IF NOT EXISTS known_devs (
  sender_hash TEXT PRIMARY KEY,
  first_seen TEXT DEFAULT (datetime('now'))
);

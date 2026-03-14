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

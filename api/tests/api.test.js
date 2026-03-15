/**
 * Integration Tests for Emocean API
 * Tests full request/response cycle with D1 database
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { env, SELF } from 'cloudflare:test';

// Helper to make requests
async function request(path, options = {}) {
  const url = `http://localhost${path}`;
  const response = await SELF.fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return {
    status: response.status,
    json: await response.json(),
    headers: response.headers,
  };
}

// Helper to create a valid toss request
function createTossBody(overrides = {}) {
  return {
    message: 'Test ember message',
    tag: 'win',
    sender_id: `test_sender_${Date.now()}_${Math.random()}`,
    timezone: 'America/New_York',
    ...overrides,
  };
}

// ─── Setup ────────────────────────────────────────────────────────────

beforeAll(async () => {
  // Initialize database schema - D1 requires separate statements
  await env.DB.exec(`CREATE TABLE IF NOT EXISTS embers (id TEXT PRIMARY KEY, message TEXT NOT NULL, tag TEXT DEFAULT NULL, sender_hash TEXT NOT NULL, username TEXT NOT NULL, avatar_seed TEXT NOT NULL, timezone TEXT DEFAULT 'UTC', location_label TEXT DEFAULT 'Somewhere on Earth', stokes INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`);

  await env.DB.exec(`CREATE TABLE IF NOT EXISTS metrics (key TEXT PRIMARY KEY, value INTEGER DEFAULT 0)`);

  await env.DB.exec(`CREATE TABLE IF NOT EXISTS known_devs (sender_hash TEXT PRIMARY KEY, first_seen TEXT DEFAULT (datetime('now')))`);

  // Initialize metrics
  const metricsKeys = [
    'total_embers', 'total_stokes', 'total_devs',
    'tag_win', 'tag_struggle', 'tag_idea', 'tag_rant',
    'tag_gratitude', 'tag_late-night', 'tag_none'
  ];
  for (const key of metricsKeys) {
    await env.DB.prepare(`INSERT OR IGNORE INTO metrics (key, value) VALUES (?, 0)`).bind(key).run();
  }
});

beforeEach(async () => {
  // Clear embers and reset metrics between tests
  await env.DB.exec(`DELETE FROM embers`);
  await env.DB.exec(`DELETE FROM known_devs`);
  await env.DB.exec(`UPDATE metrics SET value = 0`);
});

// ─── Health Check ─────────────────────────────────────────────────────

describe('GET /', () => {
  it('returns API info', async () => {
    const { status, json } = await request('/');

    expect(status).toBe(200);
    expect(json.name).toBe('Emocean API');
    expect(json.version).toBe('1.0.0');
    expect(json.endpoints).toBeDefined();
  });
});

// ─── CORS ─────────────────────────────────────────────────────────────

describe('OPTIONS (CORS)', () => {
  it('handles preflight requests', async () => {
    const response = await SELF.fetch('http://localhost/toss', {
      method: 'OPTIONS',
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });
});

// ─── POST /toss ───────────────────────────────────────────────────────

describe('POST /toss', () => {
  it('creates an ember successfully', async () => {
    const body = createTossBody();
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.ember).toBeDefined();
    expect(json.ember.id).toBeDefined();
    expect(json.ember.username).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);
    expect(json.ember.avatar_url).toContain('dicebear.com');
    expect(json.ember.location).toBe('Somewhere on the US East Coast');
  });

  it('persists ember to database', async () => {
    const body = createTossBody({ message: 'Unique test message 12345' });
    await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const result = await env.DB.prepare(
      `SELECT * FROM embers WHERE message = ?`
    ).bind('Unique test message 12345').first();

    expect(result).toBeDefined();
    expect(result.message).toBe('Unique test message 12345');
    expect(result.tag).toBe('win');
  });

  it('increments metrics', async () => {
    const body = createTossBody({ tag: 'struggle' });
    await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const totalEmbers = await env.DB.prepare(
      `SELECT value FROM metrics WHERE key = 'total_embers'`
    ).first();
    const tagCount = await env.DB.prepare(
      `SELECT value FROM metrics WHERE key = 'tag_struggle'`
    ).first();
    const devCount = await env.DB.prepare(
      `SELECT value FROM metrics WHERE key = 'total_devs'`
    ).first();

    expect(totalEmbers.value).toBe(1);
    expect(tagCount.value).toBe(1);
    expect(devCount.value).toBe(1);
  });

  it('rejects missing message', async () => {
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify({ sender_id: 'test' }),
    });

    expect(status).toBe(400);
    expect(json.error).toContain('Message is required');
  });

  it('rejects message over 280 chars', async () => {
    const body = createTossBody({ message: 'a'.repeat(281) });
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(status).toBe(400);
    expect(json.error).toContain('280 characters');
  });

  it('rejects missing sender_id', async () => {
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify({ message: 'Test' }),
    });

    expect(status).toBe(400);
    expect(json.error).toContain('sender_id is required');
  });

  it('rejects invalid tag', async () => {
    const body = createTossBody({ tag: 'invalid' });
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(status).toBe(400);
    expect(json.error).toContain('Invalid tag');
  });

  it('accepts messages without tag', async () => {
    const body = createTossBody({ tag: null });
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it('blocks URLs in messages', async () => {
    const body = createTossBody({ message: 'Check out https://spam.com' });
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(status).toBe(400);
    expect(json.error).toContain('URLs');
  });

  it('blocks profanity in messages', async () => {
    const body = createTossBody({ message: 'This is shit' });
    const { status, json } = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(status).toBe(400);
    expect(json.error).toContain('kind');
  });

  it('rate limits same sender', async () => {
    const senderId = 'rate_limit_test_sender';
    const body1 = createTossBody({ sender_id: senderId });
    const body2 = createTossBody({ sender_id: senderId, message: 'Second message' });

    // First request should succeed
    const first = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body1),
    });
    expect(first.status).toBe(200);

    // Second request should be rate limited
    const second = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(body2),
    });
    expect(second.status).toBe(429);
    expect(second.json.error).toContain('Slow down');
  });

  it('handles invalid JSON', async () => {
    const response = await SELF.fetch('http://localhost/toss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json',
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toContain('Invalid JSON');
  });
});

// ─── GET /catch ───────────────────────────────────────────────────────

describe('GET /catch', () => {
  it('returns ember when campfire has embers', async () => {
    // First toss an ember
    await request('/toss', {
      method: 'POST',
      body: JSON.stringify(createTossBody()),
    });

    const { status, json } = await request('/catch');

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.ember).toBeDefined();
    expect(json.ember.message).toBeDefined();
  });

  it('returns null ember when campfire is empty', async () => {
    const { status, json } = await request('/catch');

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.ember).toBeNull();
    expect(json.message).toContain('campfire is quiet');
  });

  it('filters by tag', async () => {
    // Create embers with different tags
    await request('/toss', {
      method: 'POST',
      body: JSON.stringify(createTossBody({ tag: 'win', sender_id: 'sender1' })),
    });
    await request('/toss', {
      method: 'POST',
      body: JSON.stringify(createTossBody({ tag: 'struggle', sender_id: 'sender2' })),
    });

    const { json } = await request('/catch?tag=win');

    expect(json.ok).toBe(true);
    expect(json.ember.tag).toBe('win');
  });

  it('returns multiple embers with count param', async () => {
    // Create multiple embers
    for (let i = 0; i < 5; i++) {
      await request('/toss', {
        method: 'POST',
        body: JSON.stringify(createTossBody({ sender_id: `sender_${i}` })),
      });
    }

    const { json } = await request('/catch?count=3');

    expect(json.ok).toBe(true);
    expect(json.embers).toBeDefined();
    expect(json.embers.length).toBe(3);
    expect(json.count).toBe(3);
  });

  it('limits count to 10', async () => {
    // Create 15 embers
    for (let i = 0; i < 15; i++) {
      await request('/toss', {
        method: 'POST',
        body: JSON.stringify(createTossBody({ sender_id: `sender_${i}` })),
      });
    }

    const { json } = await request('/catch?count=100');

    expect(json.embers.length).toBeLessThanOrEqual(10);
  });

  it('excludes sender own embers', async () => {
    const senderId = 'exclude_test_sender';
    await request('/toss', {
      method: 'POST',
      body: JSON.stringify(createTossBody({ sender_id: senderId, message: 'My ember' })),
    });

    const { json } = await request(`/catch?exclude=${senderId}`);

    // Should return no embers since only one exists and it's excluded
    expect(json.ember).toBeNull();
  });

  it('rejects invalid tag filter', async () => {
    const { status, json } = await request('/catch?tag=invalid');

    expect(status).toBe(400);
    expect(json.error).toContain('Invalid tag');
  });
});

// ─── POST /stoke ──────────────────────────────────────────────────────

describe('POST /stoke', () => {
  it('increments stoke count', async () => {
    // Create an ember first
    const tossResult = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(createTossBody()),
    });
    const emberId = tossResult.json.ember.id;

    // Stoke it
    const { status, json } = await request('/stoke', {
      method: 'POST',
      body: JSON.stringify({ ember_id: emberId }),
    });

    expect(status).toBe(200);
    expect(json.ok).toBe(true);

    // Verify in database
    const ember = await env.DB.prepare(
      `SELECT stokes FROM embers WHERE id = ?`
    ).bind(emberId).first();
    expect(ember.stokes).toBe(1);
  });

  it('increments stoke metrics', async () => {
    const tossResult = await request('/toss', {
      method: 'POST',
      body: JSON.stringify(createTossBody()),
    });
    const emberId = tossResult.json.ember.id;

    await request('/stoke', {
      method: 'POST',
      body: JSON.stringify({ ember_id: emberId }),
    });

    const metric = await env.DB.prepare(
      `SELECT value FROM metrics WHERE key = 'total_stokes'`
    ).first();
    expect(metric.value).toBe(1);
  });

  it('rejects missing ember_id', async () => {
    const { status, json } = await request('/stoke', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    expect(status).toBe(400);
    expect(json.error).toContain('ember_id is required');
  });

  it('returns 404 for non-existent ember', async () => {
    const { status, json } = await request('/stoke', {
      method: 'POST',
      body: JSON.stringify({ ember_id: 'non-existent-id' }),
    });

    expect(status).toBe(404);
    expect(json.error).toContain('Ember not found');
  });
});

// ─── GET /campfire ────────────────────────────────────────────────────

describe('GET /campfire', () => {
  it('returns recent embers', async () => {
    // Create some embers
    for (let i = 0; i < 3; i++) {
      await request('/toss', {
        method: 'POST',
        body: JSON.stringify(createTossBody({ sender_id: `campfire_sender_${i}` })),
      });
    }

    const { status, json } = await request('/campfire');

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.embers).toBeDefined();
    expect(json.embers.length).toBe(3);
    expect(json.total).toBe(3);
  });

  it('respects limit parameter', async () => {
    for (let i = 0; i < 5; i++) {
      await request('/toss', {
        method: 'POST',
        body: JSON.stringify(createTossBody({ sender_id: `limit_sender_${i}` })),
      });
    }

    const { json } = await request('/campfire?limit=2');

    expect(json.embers.length).toBe(2);
  });

  it('limits max to 50', async () => {
    const { json } = await request('/campfire?limit=100');
    // Should not error, just cap at 50
    expect(json.ok).toBe(true);
  });

  it('supports pagination with offset', async () => {
    for (let i = 0; i < 5; i++) {
      await request('/toss', {
        method: 'POST',
        body: JSON.stringify(createTossBody({
          sender_id: `offset_sender_${i}`,
          message: `Message ${i}`,
        })),
      });
    }

    const page1 = await request('/campfire?limit=2&offset=0');
    const page2 = await request('/campfire?limit=2&offset=2');

    expect(page1.json.embers.length).toBe(2);
    expect(page2.json.embers.length).toBe(2);
    // Different embers on different pages
    expect(page1.json.embers[0].id).not.toBe(page2.json.embers[0].id);
  });

  it('returns empty array when no embers', async () => {
    const { json } = await request('/campfire');

    expect(json.ok).toBe(true);
    expect(json.embers).toEqual([]);
    expect(json.total).toBe(0);
  });

  it('returns embers with all expected fields', async () => {
    await request('/toss', {
      method: 'POST',
      body: JSON.stringify(createTossBody()),
    });

    const { json } = await request('/campfire');
    const ember = json.embers[0];

    expect(ember.id).toBeDefined();
    expect(ember.message).toBeDefined();
    expect(ember.tag).toBeDefined();
    expect(ember.username).toBeDefined();
    expect(ember.avatar_url).toBeDefined();
    expect(ember.location).toBeDefined();
    expect(ember.stokes).toBeDefined();
    expect(ember.created_at).toBeDefined();
  });
});

// ─── GET /stats ───────────────────────────────────────────────────────

describe('GET /stats', () => {
  it('returns campfire statistics', async () => {
    const { status, json } = await request('/stats');

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.stats).toBeDefined();
    expect(json.stats.total_embers).toBeDefined();
    expect(json.stats.total_stokes).toBeDefined();
    expect(json.stats.unique_devs).toBeDefined();
    expect(json.stats.tags).toBeDefined();
  });

  it('reflects actual counts', async () => {
    // Create embers
    for (let i = 0; i < 3; i++) {
      await request('/toss', {
        method: 'POST',
        body: JSON.stringify(createTossBody({
          sender_id: `stats_sender_${i}`,
          tag: i === 0 ? 'win' : 'struggle',
        })),
      });
    }

    // Stoke one ember
    const campfire = await request('/campfire');
    const emberId = campfire.json.embers[0].id;
    await request('/stoke', {
      method: 'POST',
      body: JSON.stringify({ ember_id: emberId }),
    });

    const { json } = await request('/stats');

    expect(json.stats.total_embers).toBe(3);
    expect(json.stats.total_stokes).toBe(1);
    expect(json.stats.unique_devs).toBe(3);
    expect(json.stats.tags.win).toBe(1);
    expect(json.stats.tags.struggle).toBe(2);
  });
});

// ─── 404 Handling ─────────────────────────────────────────────────────

describe('404 Handling', () => {
  it('returns 404 for unknown routes', async () => {
    const { status, json } = await request('/unknown');

    expect(status).toBe(404);
    expect(json.error).toBe('Not found');
  });

  it('returns 404 for wrong method on known route', async () => {
    const { status, json } = await request('/toss'); // GET instead of POST

    expect(status).toBe(404);
  });
});

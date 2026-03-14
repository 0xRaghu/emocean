/**
 * Emocean API — Cloudflare Worker + D1
 * Anonymous developer embers, glowing in the campfire.
 */

// ─── Username Generator ───────────────────────────────────────────────
const ADJECTIVES = [
  'Sleepy', 'Caffeinated', 'Grumpy', 'Zen', 'Pixelated', 'Cosmic',
  'Fuzzy', 'Glitchy', 'Rusty', 'Neon', 'Midnight', 'Wandering',
  'Silent', 'Electric', 'Foggy', 'Restless', 'Drifting', 'Bouncy',
  'Wobbly', 'Cryptic', 'Mellow', 'Fizzy', 'Stormy', 'Lunar',
  'Solar', 'Velvet', 'Turbo', 'Dusty', 'Frosty', 'Blazing',
  'Chill', 'Hasty', 'Lazy', 'Jolly', 'Witty', 'Quirky',
  'Sneaky', 'Brave', 'Dizzy', 'Lucky', 'Spicy', 'Tangled',
  'Bubbly', 'Cloudy', 'Toasty', 'Wired', 'Analog', 'Binary',
  'Stealth', 'Chaotic'
];

const CREATURES = [
  'Octopus', 'Starfish', 'Narwhal', 'Jellyfish', 'Seahorse', 'Dolphin',
  'Turtle', 'Penguin', 'Whale', 'Pufferfish', 'Crab', 'Lobster',
  'Otter', 'Seal', 'Squid', 'Shrimp', 'Clownfish', 'Swordfish',
  'Manatee', 'Walrus', 'Pelican', 'Stingray', 'Urchin', 'Coral',
  'Anglerfish', 'Barracuda', 'Manta', 'Marlin', 'Oyster', 'Nautilus',
  'Axolotl', 'Blowfish', 'Capybara', 'Dugong', 'Flounder', 'Grouper',
  'Herring', 'Isopod', 'Krill', 'Lamprey', 'Moray', 'Nudibranch',
  'Plankton', 'Remora', 'Sailfish', 'Tuna', 'Viperfish', 'Anchovy',
  'Beluga', 'Cuttlefish'
];

// ─── Timezone → Location Mapping ──────────────────────────────────────
const TIMEZONE_LOCATIONS = {
  // Americas
  'America/': 'Somewhere in the Americas',
  'US/': 'Somewhere in the Americas',
  'Canada/': 'Somewhere in the Americas',
  'Pacific/Honolulu': 'Somewhere near Hawaii',
  'America/New_York': 'Somewhere on the US East Coast',
  'America/Chicago': 'Somewhere in the US Midwest',
  'America/Denver': 'Somewhere in the US Mountain region',
  'America/Los_Angeles': 'Somewhere on the US West Coast',
  'America/Toronto': 'Somewhere in Eastern Canada',
  'America/Vancouver': 'Somewhere in Western Canada',
  'America/Mexico_City': 'Somewhere in Mexico',
  'America/Sao_Paulo': 'Somewhere in Brazil',
  'America/Argentina/Buenos_Aires': 'Somewhere in South America',
  'America/Bogota': 'Somewhere in South America',
  'America/Santiago': 'Somewhere in South America',
  // Europe
  'Europe/London': 'Somewhere in the UK',
  'Europe/Paris': 'Somewhere in Western Europe',
  'Europe/Berlin': 'Somewhere in Central Europe',
  'Europe/Madrid': 'Somewhere in Southern Europe',
  'Europe/Rome': 'Somewhere in Southern Europe',
  'Europe/Amsterdam': 'Somewhere in Western Europe',
  'Europe/Stockholm': 'Somewhere in Scandinavia',
  'Europe/Oslo': 'Somewhere in Scandinavia',
  'Europe/Helsinki': 'Somewhere in Northern Europe',
  'Europe/Moscow': 'Somewhere in Russia',
  'Europe/Istanbul': 'Somewhere near Turkey',
  'Europe/Warsaw': 'Somewhere in Eastern Europe',
  'Europe/Bucharest': 'Somewhere in Eastern Europe',
  'Europe/Athens': 'Somewhere in Southern Europe',
  'Europe/Lisbon': 'Somewhere in Western Europe',
  'Europe/Dublin': 'Somewhere in Ireland',
  'Europe/Zurich': 'Somewhere in Central Europe',
  'Europe/Vienna': 'Somewhere in Central Europe',
  'Europe/Prague': 'Somewhere in Central Europe',
  'Europe/': 'Somewhere in Europe',
  // Asia
  'Asia/Tokyo': 'Somewhere near Japan',
  'Asia/Seoul': 'Somewhere near Korea',
  'Asia/Shanghai': 'Somewhere in East Asia',
  'Asia/Hong_Kong': 'Somewhere in East Asia',
  'Asia/Taipei': 'Somewhere in East Asia',
  'Asia/Singapore': 'Somewhere in Southeast Asia',
  'Asia/Bangkok': 'Somewhere in Southeast Asia',
  'Asia/Jakarta': 'Somewhere in Southeast Asia',
  'Asia/Manila': 'Somewhere in Southeast Asia',
  'Asia/Ho_Chi_Minh': 'Somewhere in Southeast Asia',
  'Asia/Kolkata': 'Somewhere in South Asia',
  'Asia/Colombo': 'Somewhere in South Asia',
  'Asia/Dhaka': 'Somewhere in South Asia',
  'Asia/Karachi': 'Somewhere in South Asia',
  'Asia/Dubai': 'Somewhere in the Middle East',
  'Asia/Riyadh': 'Somewhere in the Middle East',
  'Asia/Tehran': 'Somewhere in the Middle East',
  'Asia/Jerusalem': 'Somewhere in the Middle East',
  'Asia/Tbilisi': 'Somewhere in the Caucasus',
  'Asia/Almaty': 'Somewhere in Central Asia',
  'Asia/Tashkent': 'Somewhere in Central Asia',
  'Asia/': 'Somewhere in Asia',
  // Oceania
  'Australia/Sydney': 'Somewhere in Australia',
  'Australia/Melbourne': 'Somewhere in Australia',
  'Australia/Perth': 'Somewhere in Western Australia',
  'Australia/Brisbane': 'Somewhere in Australia',
  'Australia/': 'Somewhere in Australia',
  'Pacific/Auckland': 'Somewhere in New Zealand',
  'Pacific/Fiji': 'Somewhere in the Pacific Islands',
  'Pacific/': 'Somewhere in the Pacific',
  // Africa
  'Africa/Cairo': 'Somewhere in North Africa',
  'Africa/Lagos': 'Somewhere in West Africa',
  'Africa/Nairobi': 'Somewhere in East Africa',
  'Africa/Johannesburg': 'Somewhere in Southern Africa',
  'Africa/Casablanca': 'Somewhere in North Africa',
  'Africa/': 'Somewhere in Africa',
  // Other
  'Indian/': 'Somewhere near the Indian Ocean',
  'Atlantic/': 'Somewhere near the Atlantic',
};

function resolveLocation(timezone) {
  if (!timezone) return 'Somewhere on Earth';
  if (TIMEZONE_LOCATIONS[timezone]) return TIMEZONE_LOCATIONS[timezone];
  const prefixes = Object.keys(TIMEZONE_LOCATIONS).filter(k => k.endsWith('/'));
  prefixes.sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (timezone.startsWith(prefix)) return TIMEZONE_LOCATIONS[prefix];
  }
  return 'Somewhere on Earth';
}

// ─── Hashing ──────────────────────────────────────────────────────────
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hashToIndex(hash, max) {
  return parseInt(hash.substring(0, 8), 16) % max;
}

function generateUsername(hash) {
  const adj = ADJECTIVES[hashToIndex(hash, ADJECTIVES.length)];
  const creature = CREATURES[hashToIndex(hash.substring(8), CREATURES.length)];
  const num = (parseInt(hash.substring(16, 20), 16) % 900) + 100;
  return `${adj}${creature}${num}`;
}

function generateAvatarSeed(hash) {
  return hash.substring(0, 12);
}

function generateId() {
  return crypto.randomUUID();
}

// ─── CORS ─────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function corsResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// ─── Content Moderation ───────────────────────────────────────────────

// Block URLs to prevent spam/ads
const URL_PATTERN = /(https?:\/\/|www\.|\.com\b|\.io\b|\.xyz\b|\.ai\b|\.dev\b|\.net\b|\.org\b|bit\.ly|t\.co)/i;

// Basic profanity blocklist (extend as needed)
const BLOCKLIST = [
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy',
  'nigger', 'faggot', 'retard', 'kys', 'kill yourself'
];

function containsBlockedContent(message) {
  // Check for URLs
  if (URL_PATTERN.test(message)) {
    return { blocked: true, reason: 'URLs are not allowed. Keep it personal.' };
  }

  // Check for profanity
  const lowerMsg = message.toLowerCase();
  for (const word of BLOCKLIST) {
    if (lowerMsg.includes(word)) {
      return { blocked: true, reason: 'Keep it kind. This is a campfire, not a battlefield.' };
    }
  }

  return { blocked: false };
}

// ─── Route Handlers ───────────────────────────────────────────────────

/**
 * POST /toss — Toss an ember into the campfire
 */
async function handleToss(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return corsResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { message, tag, sender_id, timezone } = body;

  if (!message || typeof message !== 'string') {
    return corsResponse({ error: 'Message is required' }, 400);
  }

  if (message.length > 280) {
    return corsResponse({ error: 'Message must be 280 characters or less' }, 400);
  }

  if (!sender_id || typeof sender_id !== 'string') {
    return corsResponse({ error: 'sender_id is required' }, 400);
  }

  const validTags = ['win', 'struggle', 'idea', 'rant', 'gratitude', 'late-night', null, undefined, ''];
  const cleanTag = tag && typeof tag === 'string' ? tag.replace('#', '').toLowerCase().trim() : null;
  if (cleanTag && !validTags.includes(cleanTag)) {
    return corsResponse({ error: `Invalid tag. Use one of: ${validTags.filter(Boolean).join(', ')}` }, 400);
  }

  // Content moderation
  const moderation = containsBlockedContent(message);
  if (moderation.blocked) {
    return corsResponse({ error: moderation.reason }, 400);
  }

  const senderHash = await sha256(sender_id);

  // Rate limiting: 1 ember per sender per 60 seconds
  const recentEmber = await env.DB.prepare(
    `SELECT created_at FROM embers
     WHERE sender_hash = ?
     AND created_at > datetime('now', '-1 minute')
     LIMIT 1`
  ).bind(senderHash).first();

  if (recentEmber) {
    return corsResponse({ error: 'Slow down. Wait a minute before tossing another ember.' }, 429);
  }
  const username = generateUsername(senderHash);
  const avatarSeed = generateAvatarSeed(senderHash);
  const locationLabel = resolveLocation(timezone || null);

  const id = generateId();

  await env.DB.prepare(
    `INSERT INTO embers (id, message, tag, sender_hash, username, avatar_seed, timezone, location_label)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, message.trim(), cleanTag || null, senderHash, username, avatarSeed, timezone || 'UTC', locationLabel).run();

  return corsResponse({
    ok: true,
    ember: {
      id,
      username,
      avatar_url: `https://api.dicebear.com/9.x/micah/svg?seed=${avatarSeed}`,
      location: locationLabel,
    }
  });
}

/**
 * GET /catch — Catch a random ember from the campfire
 */
async function handleCatch(request, env) {
  const url = new URL(request.url);
  const excludeSender = url.searchParams.get('exclude');
  const excludeHash = excludeSender ? await sha256(excludeSender) : null;

  let result;
  if (excludeHash) {
    result = await env.DB.prepare(
      `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
       FROM embers
       WHERE sender_hash != ?
       AND created_at > datetime('now', '-7 days')
       ORDER BY RANDOM()
       LIMIT 1`
    ).bind(excludeHash).first();

    if (!result) {
      result = await env.DB.prepare(
        `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
         FROM embers
         WHERE sender_hash != ?
         ORDER BY RANDOM()
         LIMIT 1`
      ).bind(excludeHash).first();
    }
  } else {
    result = await env.DB.prepare(
      `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
       FROM embers
       WHERE created_at > datetime('now', '-7 days')
       ORDER BY RANDOM()
       LIMIT 1`
    ).first();

    if (!result) {
      result = await env.DB.prepare(
        `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
         FROM embers
         ORDER BY RANDOM()
         LIMIT 1`
      ).first();
    }
  }

  if (!result) {
    return corsResponse({
      ok: true,
      ember: null,
      message: 'The campfire is quiet right now. Toss an ember to get things started.'
    });
  }

  return corsResponse({
    ok: true,
    ember: {
      id: result.id,
      message: result.message,
      tag: result.tag,
      username: result.username,
      avatar_url: `https://api.dicebear.com/9.x/micah/svg?seed=${result.avatar_seed}`,
      location: result.location_label,
      stokes: result.stokes,
      created_at: result.created_at,
    }
  });
}

/**
 * POST /stoke — Stoke an ember (react: "I felt this")
 */
async function handleStoke(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return corsResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { ember_id } = body;
  if (!ember_id) {
    return corsResponse({ error: 'ember_id is required' }, 400);
  }

  const result = await env.DB.prepare(
    `UPDATE embers SET stokes = stokes + 1 WHERE id = ?`
  ).bind(ember_id).run();

  if (result.meta.changes === 0) {
    return corsResponse({ error: 'Ember not found' }, 404);
  }

  return corsResponse({ ok: true });
}

/**
 * GET /campfire — Get recent embers (for landing page)
 */
async function handleCampfire(request, env) {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
  const offset = parseInt(url.searchParams.get('offset') || '0');

  const results = await env.DB.prepare(
    `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
     FROM embers
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`
  ).bind(limit, offset).all();

  const count = await env.DB.prepare(`SELECT COUNT(*) as total FROM embers`).first();

  return corsResponse({
    ok: true,
    embers: (results.results || []).map(e => ({
      id: e.id,
      message: e.message,
      tag: e.tag,
      username: e.username,
      avatar_url: `https://api.dicebear.com/9.x/micah/svg?seed=${e.avatar_seed}`,
      location: e.location_label,
      stokes: e.stokes,
      created_at: e.created_at,
    })),
    total: count?.total || 0,
  });
}

/**
 * GET /stats — Campfire statistics
 */
async function handleStats(env) {
  const total = await env.DB.prepare(`SELECT COUNT(*) as total FROM embers`).first();
  const today = await env.DB.prepare(
    `SELECT COUNT(*) as today FROM embers WHERE created_at > datetime('now', '-24 hours')`
  ).first();
  const stokes = await env.DB.prepare(
    `SELECT COALESCE(SUM(stokes), 0) as total_stokes FROM embers`
  ).first();
  const devs = await env.DB.prepare(
    `SELECT COUNT(DISTINCT sender_hash) as unique_devs FROM embers`
  ).first();

  return corsResponse({
    ok: true,
    stats: {
      total_embers: total?.total || 0,
      embers_today: today?.today || 0,
      total_stokes: stokes?.total_stokes || 0,
      unique_devs: devs?.unique_devs || 0,
    }
  });
}

// ─── Main Handler ─────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // POST /toss — toss an ember into the campfire
      if (path === '/toss' && request.method === 'POST') {
        return handleToss(request, env);
      }

      // GET /catch — catch a random ember
      if (path === '/catch' && request.method === 'GET') {
        return handleCatch(request, env);
      }

      // POST /stoke — stoke an ember
      if (path === '/stoke' && request.method === 'POST') {
        return handleStoke(request, env);
      }

      // GET /campfire — get recent embers (for landing page)
      if (path === '/campfire' && request.method === 'GET') {
        return handleCampfire(request, env);
      }

      // GET /stats — campfire statistics
      if (path === '/stats' && request.method === 'GET') {
        return handleStats(env);
      }

      // GET / — health check
      if (path === '/' && request.method === 'GET') {
        return corsResponse({
          name: 'Emocean API',
          version: '1.0.0',
          description: 'Anonymous developer embers, glowing in the campfire.',
          endpoints: {
            'POST /toss': 'Toss an ember into the campfire',
            'GET /catch': 'Catch a random ember',
            'POST /stoke': 'Stoke an ember (react)',
            'GET /campfire': 'Get recent embers',
            'GET /stats': 'Campfire statistics',
          }
        });
      }

      return corsResponse({ error: 'Not found' }, 404);
    } catch (err) {
      console.error('Error:', err);
      return corsResponse({ error: 'Internal server error' }, 500);
    }
  },
};

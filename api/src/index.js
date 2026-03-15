/**
 * Emocean API — Cloudflare Worker + D1
 * Anonymous developer embers, glowing in the campfire.
 */

import {
  resolveLocation,
  sha256,
  generateUsername,
  generateAvatarSeed,
  generateId,
  containsBlockedContent,
  validateTag,
  validateMessage,
  validateSenderId,
  corsResponse,
  CORS_HEADERS,
  VALID_TAGS,
} from './utils.js';

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

  // Validate message
  const msgValidation = validateMessage(message);
  if (!msgValidation.valid) {
    return corsResponse({ error: msgValidation.error }, 400);
  }

  // Validate sender_id
  const senderValidation = validateSenderId(sender_id);
  if (!senderValidation.valid) {
    return corsResponse({ error: senderValidation.error }, 400);
  }

  // Validate tag
  const tagValidation = validateTag(tag);
  if (!tagValidation.valid) {
    return corsResponse({ error: tagValidation.error }, 400);
  }
  const cleanTag = tagValidation.cleanTag;

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

  // Update persistent metrics
  await env.DB.prepare(`UPDATE metrics SET value = value + 1 WHERE key = 'total_embers'`).run();

  // Track tag metrics
  const tagKey = cleanTag ? `tag_${cleanTag}` : 'tag_none';
  await env.DB.prepare(`UPDATE metrics SET value = value + 1 WHERE key = ?`).bind(tagKey).run();

  // Check if new dev (first ember from this sender)
  const existingDev = await env.DB.prepare(`SELECT 1 FROM known_devs WHERE sender_hash = ?`).bind(senderHash).first();
  if (!existingDev) {
    await env.DB.prepare(`INSERT INTO known_devs (sender_hash) VALUES (?)`).bind(senderHash).run();
    await env.DB.prepare(`UPDATE metrics SET value = value + 1 WHERE key = 'total_devs'`).run();
  }

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
 * GET /catch — Catch random ember(s) from the campfire
 * Params: ?tag=win (filter by tag), ?count=3 (multiple embers), ?exclude=sender_id
 * Prioritizes fresh embers (24h) and hot embers (48h with 5+ stokes)
 */
async function handleCatch(request, env) {
  const url = new URL(request.url);
  const excludeSender = url.searchParams.get('exclude');
  const excludeHash = excludeSender ? await sha256(excludeSender) : null;
  const tagFilter = url.searchParams.get('tag');
  const count = Math.min(Math.max(parseInt(url.searchParams.get('count') || '1'), 1), 10);

  // Validate tag if provided
  if (tagFilter && !VALID_TAGS.includes(tagFilter)) {
    return corsResponse({ error: `Invalid tag. Use one of: ${VALID_TAGS.join(', ')}` }, 400);
  }

  // Build WHERE clauses with parameterized queries
  const timeFilter = `(created_at > datetime('now', '-24 hours') OR (stokes >= 5 AND created_at > datetime('now', '-48 hours')))`;
  const conditions = [timeFilter];
  const fallbackConditions = [];
  const params = [];
  const fallbackParams = [];

  if (excludeHash) {
    conditions.push(`sender_hash != ?`);
    fallbackConditions.push(`sender_hash != ?`);
    params.push(excludeHash);
    fallbackParams.push(excludeHash);
  }
  if (tagFilter) {
    conditions.push(`tag = ?`);
    fallbackConditions.push(`tag = ?`);
    params.push(tagFilter);
    fallbackParams.push(tagFilter);
  }

  const whereClause = conditions.join(' AND ');
  const fallbackWhere = fallbackConditions.length > 0 ? fallbackConditions.join(' AND ') : '1=1';

  // Add count as last param
  params.push(count);
  fallbackParams.push(count);

  let results = await env.DB.prepare(
    `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
     FROM embers
     WHERE ${whereClause}
     ORDER BY RANDOM()
     LIMIT ?`
  ).bind(...params).all();

  // Fallback to any matching ember if campfire is quiet
  if (!results.results?.length) {
    results = await env.DB.prepare(
      `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
       FROM embers
       ${fallbackConditions.length > 0 ? `WHERE ${fallbackWhere}` : ''}
       ORDER BY RANDOM()
       LIMIT ?`
    ).bind(...fallbackParams).all();
  }

  const embers = (results.results || []).map(e => ({
    id: e.id,
    message: e.message,
    tag: e.tag,
    username: e.username,
    avatar_url: `https://api.dicebear.com/9.x/micah/svg?seed=${e.avatar_seed}`,
    location: e.location_label,
    stokes: e.stokes,
    created_at: e.created_at,
  }));

  // Return single ember for count=1 (backwards compatible), array for count>1
  if (count === 1) {
    const ember = embers[0] || null;
    if (!ember) {
      return corsResponse({
        ok: true,
        ember: null,
        message: tagFilter
          ? `No embers with tag #${tagFilter} right now. Try another tag or toss one!`
          : 'The campfire is quiet right now. Toss an ember to get things started.'
      });
    }
    return corsResponse({ ok: true, ember });
  }

  // Multiple embers requested
  return corsResponse({
    ok: true,
    embers,
    count: embers.length,
    message: embers.length === 0
      ? (tagFilter ? `No embers with tag #${tagFilter} right now.` : 'The campfire is quiet.')
      : null
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

  // Update persistent stoke count
  await env.DB.prepare(`UPDATE metrics SET value = value + 1 WHERE key = 'total_stokes'`).run();

  return corsResponse({ ok: true });
}

/**
 * GET /campfire — Get recent embers (for landing page)
 * Only shows embers from the last 24 hours, with hot embers (5+ stokes) getting 48h visibility
 */
async function handleCampfire(request, env) {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
  const offset = parseInt(url.searchParams.get('offset') || '0');

  // Fresh embers (24h) + hot embers (48h with 5+ stokes)
  const results = await env.DB.prepare(
    `SELECT id, message, tag, username, avatar_seed, location_label, stokes, created_at
     FROM embers
     WHERE created_at > datetime('now', '-24 hours')
        OR (stokes >= 5 AND created_at > datetime('now', '-48 hours'))
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`
  ).bind(limit, offset).all();

  const count = await env.DB.prepare(
    `SELECT COUNT(*) as total FROM embers
     WHERE created_at > datetime('now', '-24 hours')
        OR (stokes >= 5 AND created_at > datetime('now', '-48 hours'))`
  ).first();

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
 * Cleanup — Purge embers older than 7 days (called by cron)
 */
async function handleCleanup(env) {
  const result = await env.DB.prepare(
    `DELETE FROM embers WHERE created_at < datetime('now', '-7 days')`
  ).run();

  return corsResponse({
    ok: true,
    purged: result.meta.changes || 0,
  });
}

/**
 * GET /stats — Campfire statistics (uses persistent metrics)
 */
async function handleStats(env) {
  // Get all metrics in one query
  const metricsResult = await env.DB.prepare(`SELECT key, value FROM metrics`).all();
  const metrics = {};
  for (const row of metricsResult.results || []) {
    metrics[row.key] = row.value;
  }

  // Get today's activity (from live embers table)
  const today = await env.DB.prepare(
    `SELECT COUNT(*) as today FROM embers WHERE created_at > datetime('now', '-24 hours')`
  ).first();

  // Get active embers count (currently visible in campfire)
  const active = await env.DB.prepare(
    `SELECT COUNT(*) as active FROM embers
     WHERE created_at > datetime('now', '-24 hours')
        OR (stokes >= 5 AND created_at > datetime('now', '-48 hours'))`
  ).first();

  return corsResponse({
    ok: true,
    stats: {
      // Persistent totals (never decrease)
      total_embers: metrics.total_embers || 0,
      total_stokes: metrics.total_stokes || 0,
      unique_devs: metrics.total_devs || 0,
      // Live counts
      embers_today: today?.today || 0,
      active_embers: active?.active || 0,
      // Tag breakdown
      tags: {
        win: metrics.tag_win || 0,
        struggle: metrics.tag_struggle || 0,
        idea: metrics.tag_idea || 0,
        rant: metrics.tag_rant || 0,
        gratitude: metrics.tag_gratitude || 0,
        'late-night': metrics['tag_late-night'] || 0,
        none: metrics.tag_none || 0,
      }
    }
  });
}

// ─── Main Handler ─────────────────────────────────────────────────────

export default {
  // Cron trigger for daily cleanup
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleCleanup(env));
  },

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

// Export handlers for testing
export {
  handleToss,
  handleCatch,
  handleStoke,
  handleCampfire,
  handleStats,
  handleCleanup,
};

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# api

## Purpose
Emocean API is a Cloudflare Workers + D1 backend for an anonymous developer community platform. Developers toss micro-messages ("embers") into a shared "campfire," react to others' embers ("stoke"), and browse statistics. The system prioritizes anonymity, content moderation, and rate limiting.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.js` | Main API routes and request handlers (toss, catch, stoke, campfire, stats, cleanup) |
| `src/utils.js` | Utility functions (username generation, location resolution, validation, CORS) |
| `schema.sql` | D1 database schema (embers, metrics, known_devs tables with indices) |
| `wrangler.toml` | Cloudflare Workers configuration, D1 database binding, cron trigger |
| `package.json` | Dependencies: wrangler, vitest, @cloudflare/vitest-pool-workers |
| `vitest.config.js` | Vitest configuration for Cloudflare Workers testing |
| `tests/api.test.js` | Integration tests for all endpoints (568 lines, 40+ test cases) |
| `tests/utils.test.js` | Unit tests for utility functions (348 lines, 60+ test cases) |

## Subdirectories
None. This is a single-tier API. All source code is in `src/`, all tests in `tests/`, configuration at root.

## For AI Agents

### Working In This Directory

1. **Local Development**
   ```bash
   npm run dev
   ```
   Starts local Cloudflare Workers dev server with D1 database emulation.

2. **Testing**
   ```bash
   npm test          # Run all tests once
   npm run test:watch # Watch mode for development
   ```
   Tests run against in-memory D1 database via vitest-pool-workers.

3. **Deployment**
   ```bash
   npm run deploy
   ```
   Deploys to Cloudflare Workers (requires `wrangler` auth).

4. **Key Patterns**
   - All responses use `corsResponse()` helper (applies CORS headers + JSON serialization)
   - All database queries use parameterized `.prepare().bind()` (SQL injection safe)
   - Sender anonymity via SHA-256 hashing of `sender_id` before storing
   - Rate limiting: 1 ember per sender per 60 seconds
   - Content moderation: URL blocking + profanity filtering
   - Cron trigger: Daily cleanup at 3am UTC (deletes embers older than 7 days)

### API Endpoints

#### Health Check
```
GET /
```
Returns API info and endpoint list.

**Response:**
```json
{
  "name": "Emocean API",
  "version": "1.0.0",
  "description": "Anonymous developer embers, glowing in the campfire.",
  "endpoints": { ... }
}
```

#### Toss an Ember
```
POST /toss
```
Create a new anonymous message in the campfire.

**Request:**
```json
{
  "message": "string (required, max 280 chars)",
  "sender_id": "string (required, hashed for anonymity)",
  "tag": "string (optional: win|struggle|idea|rant|gratitude|late-night)",
  "timezone": "string (optional: IANA timezone, used for location inference)"
}
```

**Response (200):**
```json
{
  "ok": true,
  "ember": {
    "id": "uuid",
    "username": "AdjectiveCreature###",
    "avatar_url": "https://api.dicebear.com/9.x/micah/svg?seed=...",
    "location": "Somewhere on the US East Coast"
  }
}
```

**Errors:**
- `400` – Missing/invalid message, sender_id, or tag; message too long; contains URLs or profanity
- `429` – Rate limited (same sender within 60 seconds)

**Notes:**
- Sender hash is deterministic: same `sender_id` always generates same username and avatar
- Username format: `AdjectiveCreature###` (e.g., `ZenOctopus457`)
- Timezone examples: `America/New_York`, `Europe/London`, `Asia/Tokyo`
- Messages are trimmed of whitespace before storage

#### Catch a Random Ember
```
GET /catch?tag=win&count=1&exclude=sender_id
```
Retrieve random embers from the campfire.

**Query Parameters:**
- `tag` – Filter by tag (one of: win, struggle, idea, rant, gratitude, late-night)
- `count` – Number of embers to return (1-10, default: 1)
- `exclude` – Sender ID to exclude (prevents self-matching)

**Response (count=1, 200):**
```json
{
  "ok": true,
  "ember": {
    "id": "uuid",
    "message": "string",
    "tag": "win",
    "username": "AdjectiveCreature###",
    "avatar_url": "https://api.dicebear.com/9.x/micah/svg?seed=...",
    "location": "Somewhere on Earth",
    "stokes": 5,
    "created_at": "2025-03-15T12:34:56.000Z"
  }
}
```

**Response (count>1, 200):**
```json
{
  "ok": true,
  "embers": [ ... ],
  "count": 3,
  "message": null
}
```

**Response (empty campfire, 200):**
```json
{
  "ok": true,
  "ember": null,
  "message": "The campfire is quiet right now. Toss an ember to get things started."
}
```

**Logic:**
- First tries to fetch embers < 24h old
- Falls back to hot embers (5+ stokes, < 48h old)
- Falls back to any matching embers if quiet
- Randomized selection (ORDER BY RANDOM())

**Errors:**
- `400` – Invalid tag filter

#### Stoke an Ember
```
POST /stoke
```
React to an ember (increment stoke counter).

**Request:**
```json
{
  "ember_id": "uuid (required)"
}
```

**Response (200):**
```json
{
  "ok": true
}
```

**Errors:**
- `400` – Missing ember_id
- `404` – Ember not found

**Notes:**
- Unlimited stokes per ember, no rate limiting per user
- Increments both ember's `stokes` field and global `total_stokes` metric

#### Get Campfire Feed
```
GET /campfire?limit=20&offset=0
```
Get recent/hot embers for landing page feed.

**Query Parameters:**
- `limit` – Results per page (1-50, default: 20)
- `offset` – Pagination offset (default: 0)

**Response (200):**
```json
{
  "ok": true,
  "embers": [ ... ],
  "total": 47
}
```

**Each ember includes:**
- id, message, tag, username, avatar_url, location, stokes, created_at

**Logic:**
- Embers < 24h old OR (5+ stokes AND < 48h old)
- Ordered by `created_at DESC` (newest first)
- Includes pagination count

#### Campfire Statistics
```
GET /stats
```
Get campfire metrics and tag breakdown.

**Response (200):**
```json
{
  "ok": true,
  "stats": {
    "total_embers": 1247,
    "total_stokes": 3891,
    "unique_devs": 156,
    "embers_today": 42,
    "active_embers": 38,
    "tags": {
      "win": 320,
      "struggle": 290,
      "idea": 215,
      "rant": 180,
      "gratitude": 142,
      "late-night": 100,
      "none": 0
    }
  }
}
```

**Metrics:**
- `total_embers` – Persistent count (never decreases, survives cleanup)
- `total_stokes` – Persistent count
- `unique_devs` – Count of unique sender hashes ever seen
- `embers_today` – Live count of embers < 24h
- `active_embers` – Live count visible in campfire (24h or 48h with 5+ stokes)
- `tags` – Persistent breakdown by tag

### Testing Requirements

**Unit Tests (utils.test.js):**
- Test validation functions: `validateMessage`, `validateTag`, `validateSenderId`
- Test blocking: `containsBlockedContent` (URLs, profanity)
- Test generation: `generateUsername`, `generateAvatarSeed`
- Test location: `resolveLocation` (timezone → location mapping)
- Test CORS: `corsResponse` (headers + JSON serialization)

**Integration Tests (api.test.js):**
- Full request/response cycle with in-memory D1 database
- All endpoints: toss, catch, stoke, campfire, stats, health check
- Rate limiting behavior
- Pagination and filtering
- Error handling and status codes
- Metrics persistence and accuracy

**Running Tests:**
```bash
npm test              # Run once, exit with coverage report
npm run test:watch   # Watch mode, re-run on file changes
```

**Test Database:**
- Automatically initialized via `beforeAll` hook
- Cleared between tests via `beforeEach` hook
- Tables: embers, metrics, known_devs

**Key Test Files:**
- `/tests/api.test.js` – 40+ integration test cases (568 lines)
- `/tests/utils.test.js` – 60+ unit test cases (348 lines)

## Dependencies

### External

| Package | Version | Purpose |
|---------|---------|---------|
| `wrangler` | ^4.10.0 | Cloudflare Workers CLI (dev, deploy, local runtime) |
| `@cloudflare/workers-types` | ^4.20250313.0 | TypeScript types for CF APIs |
| `vitest` | ^3.0.9 | Unit testing framework |
| `@cloudflare/vitest-pool-workers` | ^0.8.0 | Vitest integration with Cloudflare Workers (D1 support) |

### Internal

No other npm dependencies. All code is vanilla JavaScript using Cloudflare's built-in APIs:
- `crypto.subtle.digest()` – SHA-256 hashing
- `crypto.randomUUID()` – ID generation
- Cloudflare Worker Request/Response APIs
- D1 Database API via `env.DB`

### Database (D1)

**Database ID:** `6727c215-2fa8-42dc-9967-427f9a8fb262`

**Tables:**
- `embers` – Main data (id, message, tag, sender_hash, username, avatar_seed, timezone, location_label, stokes, created_at)
- `metrics` – Persistent counters (key, value) for total_embers, total_stokes, total_devs, tag_*
- `known_devs` – Unique sender hashes (sender_hash, first_seen)

**Indices:**
- `idx_embers_created_at` – For recent/old ember queries
- `idx_embers_sender_hash` – For rate limiting and exclude filters

### Configuration

**wrangler.toml:**
- Compatibility date: 2026-03-01
- Node.js compatibility: enabled
- Cron trigger: Daily cleanup at 3am UTC (`0 3 * * *`)

<!-- MANUAL: Add notes about deployment, monitoring, or future work below -->

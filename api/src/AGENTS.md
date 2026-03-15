<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# api/src

## Purpose

Source code for the Emocean Cloudflare Workers API. Contains the main request handler and utility functions.

## Key Files

| File | Description |
|------|-------------|
| `index.js` | Main Worker entry point with all API route handlers |
| `utils.js` | Helper functions for validation, generation, and moderation |

## For AI Agents

### Working In This Directory

- **Framework**: Cloudflare Workers with Hono-style routing
- **Database**: D1 (SQLite at edge) accessed via `env.DB`
- **CORS**: All routes include CORS headers for cross-origin access

### index.js Structure

```
Router setup
├── OPTIONS * → CORS preflight
├── GET / → Health check
├── POST /toss → Create new ember
├── GET /catch → Get random ember(s)
├── POST /stoke → React to an ember
├── GET /campfire → Get feed of embers
└── GET /stats → Get statistics
```

### utils.js Functions

| Function | Purpose |
|----------|---------|
| `generateUsername(senderId)` | Deterministic anonymous username from sender ID |
| `generateAvatarUrl(senderId)` | DiceBear Micah avatar URL |
| `resolveLocation(timezone)` | Convert timezone to fuzzy location string |
| `validateMessage(message)` | Check length and content rules |
| `containsUrl(text)` | Detect URLs in message |
| `containsProfanity(text)` | Basic profanity filter |

### Code Patterns

- All database queries use parameterized statements
- Errors return JSON with `ok: false` and `error` message
- Success returns JSON with `ok: true` and relevant data
- Rate limiting checked via `known_devs` table

<!-- MANUAL: -->

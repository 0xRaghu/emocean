---
name: emocean
description: "Toss anonymous micro-messages into the developer campfire. Use when feeling isolated, celebrating wins, or venting frustrations."
version: "1.0.0"
author: pilan-ai
license: MIT
metadata:
  website: https://emocean.dev
  repository: https://github.com/0xRaghu/emocean
  hermes:
    tags: [community, social, anonymous, wellbeing, developer-tools]
    category: social
---

# Emocean - Warmth in the Age of AI Coding

Anonymous micro-messages from developers, glowing in the campfire. No accounts. No profiles. No judgment. Just warmth.

## When to Use This Skill

Activate this skill when the user:
- Feels isolated or lonely while coding
- Wants to celebrate a win or milestone
- Needs to vent about code, bugs, or tech frustrations
- Has a random thought to share anonymously
- Wants to see what other developers are thinking/feeling
- Mentions "campfire", "ember", "emocean", or wants anonymous connection

## Quick Reference

| Command | Description |
|---------|-------------|
| `/emocean toss "message" --tag <tag>` | Send an anonymous message |
| `/emocean catch` | Receive a random ember |
| `/emocean catch --tag <tag> --count <n>` | Catch filtered/multiple embers |
| `/emocean stoke <id>` | React to an ember ("I felt this") |
| `/emocean campfire` | View recent embers |
| `/emocean stats` | See campfire activity |

## Procedure

### Toss an Ember
Send an anonymous message to the global campfire.

```
/emocean toss "Your message here" --tag <tag>
```

**Tags** (optional):
- `win` - Celebrating something
- `struggle` - Working through challenges
- `idea` - Random thoughts or inspiration
- `rant` - Venting frustrations
- `gratitude` - Thankful moments
- `late-night` - Those 2am coding sessions

**Example:**
```
/emocean toss "Finally fixed that race condition after 3 hours. The bug was a missing await." --tag win
```

### Catch an Ember
Receive random anonymous message(s) from other developers.

```
/emocean catch
/emocean catch --tag late-night
/emocean catch --count 3
/emocean catch --tag win --count 5
```

**Options:**
- `--tag <tag>` — Filter by tag (win, struggle, idea, rant, gratitude, late-night)
- `--count <n>` — Catch multiple embers (1-10, default: 1)

### Stoke an Ember
Show appreciation for an ember by "stoking" it (like a campfire).

```
/emocean stoke <ember_id>
```

### View the Campfire
See multiple embers at once.

```
/emocean campfire
```

Returns up to 12 recent embers from developers worldwide.

### Check Stats
See campfire activity.

```
/emocean stats
```

## API Integration

The skill uses the Emocean API at `https://emocean-api.pilan.workers.dev`

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/toss` | POST | Send a new ember |
| `/catch` | GET | Get random ember(s) — supports `?tag=`, `?count=`, `?exclude=` |
| `/stoke` | POST | Stoke (like) an ember |
| `/campfire` | GET | Get multiple embers (for display) |
| `/stats` | GET | Get campfire statistics |

### Toss Request Format

```json
{
  "message": "Your message (max 280 chars)",
  "tag": "win|struggle|idea|rant|gratitude|late-night",
  "sender_id": "unique_anonymous_id",
  "timezone": "America/New_York"
}
```

### Response Format

```json
{
  "ok": true,
  "ember": {
    "id": "abc123",
    "username": "CosmicPenguin423",
    "avatar_url": "https://api.dicebear.com/9.x/micah/svg?seed=...",
    "location": "Somewhere on the US East Coast"
  }
}
```

## Implementation Notes

1. **Anonymous Identity**: Generate a persistent `sender_id` per user (e.g., UUID stored locally). This creates consistent anonymous usernames without accounts.

2. **Rate Limiting**: Users can only toss 1 ember per 60 seconds.

3. **Content Moderation**: URLs and profanity are blocked. Keep messages personal and kind.

4. **Timezone**: Pass the user's timezone for location-based display (e.g., "Late Night in Tokyo").

## Pitfalls

- **Rate limit errors**: Wait 60 seconds between tosses. The API returns `429` if exceeded.
- **Message too long**: Max 280 characters. Truncate or ask user to shorten.
- **Invalid tag**: Only use: `win`, `struggle`, `idea`, `rant`, `gratitude`, `late-night`. Omit tag if unsure.
- **Empty campfire**: If no embers returned, the campfire may be quiet. Encourage user to toss first.
- **Missing sender_id**: Always generate and persist a UUID. Without it, the user gets a random identity each time.

## Verification

After a successful operation:
- **Toss**: Response contains `ok: true` and `ember.id`. The ember is now in the campfire.
- **Catch**: Response contains an ember object (or array if count > 1) with `message`, `username`, `location`.
- **Stoke**: Response contains `ok: true` and updated `stokes` count.
- **Stats**: Response contains `total_embers`, `total_stokes`, `active_devs` counts.

## Example Workflow

When a user says something like "I'm so frustrated with this bug" or "finally got it working!":

1. Recognize the emotional context
2. Suggest tossing an ember: "Want to share that with the campfire? Other devs might relate."
3. If yes, call the toss endpoint with appropriate tag
4. Optionally catch an ember to show them they're not alone

## Philosophy

Emocean exists because coding can be lonely. AI assistants are powerful, but sometimes you just want to know another human is out there, grinding through the same struggles and celebrating the same wins. Every ember is a tiny reminder: you're not alone in this.

---

Website: https://emocean.dev
GitHub: https://github.com/0xRaghu/emocean

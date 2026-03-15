---
name: emocean
description: "Toss anonymous micro-messages into the developer campfire. Use when feeling isolated, celebrating wins, or venting frustrations."
license: MIT
metadata:
  author: pilan-ai
  version: "1.0.0"
  website: https://emocean.dev
  repository: https://github.com/0xRaghu/emocean
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

## Available Commands

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
Receive a random anonymous message from another developer.

```
/emocean catch
```

This returns a single random ember from the campfire - a message from a dev somewhere in the world.

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

The skill uses the Emocean API at `https://api.emocean.dev`

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/toss` | POST | Send a new ember |
| `/catch` | GET | Get a random ember |
| `/stoke` | POST | Stoke (like) an ember |
| `/campfire` | GET | Get multiple embers |
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
    "username": "cosmic_penguin",
    "avatar_url": "https://api.dicebear.com/7.x/thumbs/svg?seed=...",
    "location": "East Coast, USA"
  }
}
```

## Implementation Notes

1. **Anonymous Identity**: Generate a persistent `sender_id` per user (e.g., UUID stored locally). This creates consistent anonymous usernames without accounts.

2. **Rate Limiting**: Users can only toss 1 ember per 60 seconds.

3. **Content Moderation**: URLs and profanity are blocked. Keep messages personal and kind.

4. **Timezone**: Pass the user's timezone for location-based display (e.g., "Late Night in Tokyo").

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

# Emocean Agent Skills

**Directory**: `/skills`
**Format**: agentskills.io
**Status**: Active

## Overview

This directory contains agent skills for the Emocean platform. Emocean is an anonymous micro-messaging system for developers, enabling them to share emotional moments, wins, and struggles in a judgment-free campfire.

Skills are packaged in **agentskills.io format**, making them compatible with multiple AI agent platforms: Hermes, Claude Code, Cursor, OpenCode, and other agent-based IDEs.

---

## Directory Structure

```
skills/
└── emocean/           # Main Emocean skill
    └── SKILL.md       # agentskills.io skill definition
```

---

## What is agentskills.io?

**agentskills.io** is an open standard for defining agent skills—discrete units of functionality that AI agents can invoke in response to user context.

### Key Characteristics

- **Format**: YAML frontmatter + Markdown documentation
- **Structure**: Skill metadata (name, version, author) + activation triggers + command reference + implementation details
- **Platform-agnostic**: Works across Hermes, Claude Code, Cursor, OpenCode, and any agent system that parses this format
- **Human-readable**: Skills are documented in Markdown alongside their technical specifications

### Standard Frontmatter

```yaml
---
name: <skill-name>
description: "<brief description>"
version: "<semver>"
author: <author/org>
license: <license>
metadata:
  website: <url>
  repository: <url>
  <platform>:
    tags: [tag1, tag2]
    category: category
---
```

---

## Skill Definition: Emocean

### Metadata

| Field | Value |
|-------|-------|
| **Name** | `emocean` |
| **Version** | `1.0.0` |
| **Author** | pilan-ai |
| **License** | MIT |
| **Website** | https://emocean.dev |
| **Repository** | https://github.com/0xRaghu/emocean |

### Activation Triggers

The Emocean skill is activated when a user:

- Feels isolated or lonely while coding
- Wants to celebrate a win or milestone
- Needs to vent about code, bugs, or tech frustrations
- Has a random thought to share anonymously
- Wants to see what other developers are thinking/feeling
- Mentions keywords: "campfire", "ember", "emocean", or wants anonymous connection

### Supported Platforms

- **Hermes Agent** — Native CLI support
- **Claude Code** — Via skill invocation
- **Cursor** — Via agent commands
- **OpenCode** — Via integrated agent system
- **Any agentskills.io-compatible platform**

---

## Commands Reference

All Emocean commands use the `/emocean` prefix.

### `/emocean toss`

Send an anonymous message to the global campfire.

**Syntax:**
```
/emocean toss "Your message here" --tag <tag>
```

**Parameters:**
- `message` (required, string): Message to send (max 280 characters)
- `--tag <tag>` (optional): Categorize the ember

**Available Tags:**
| Tag | Use When |
|-----|----------|
| `win` | Celebrating a success or milestone |
| `struggle` | Working through a challenge or problem |
| `idea` | Sharing random thoughts or inspiration |
| `rant` | Venting about frustrations |
| `gratitude` | Expressing thankfulness |
| `late-night` | Those 2am coding sessions |

**Example:**
```
/emocean toss "Finally fixed that race condition after 3 hours. The bug was a missing await." --tag win
```

**Response:**
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

---

### `/emocean catch`

Receive random anonymous message(s) from developers worldwide.

**Syntax:**
```
/emocean catch [--tag <tag>] [--count <n>]
```

**Parameters:**
- `--tag <tag>` (optional): Filter by specific tag
- `--count <n>` (optional): Retrieve multiple embers (1-10, default: 1)

**Examples:**
```
/emocean catch                          # Get one random ember
/emocean catch --tag late-night        # Get one late-night ember
/emocean catch --count 3               # Get 3 random embers
/emocean catch --tag win --count 5     # Get 5 win-tagged embers
```

**Response (single ember):**
```json
{
  "message": "Just shipped my first open source contribution!",
  "username": "PhoenixDev88",
  "avatar_url": "https://api.dicebear.com/9.x/micah/svg?seed=...",
  "location": "Somewhere in the Pacific",
  "tag": "win",
  "stokes": 42,
  "created_at": "2026-03-15T02:30:00Z"
}
```

---

### `/emocean stoke`

Show appreciation for an ember by "stoking" it (like a campfire).

**Syntax:**
```
/emocean stoke <ember_id>
```

**Parameters:**
- `ember_id` (required, string): ID of the ember to stoke

**Example:**
```
/emocean stoke abc123
```

**Response:**
```json
{
  "ok": true,
  "stokes": 43,
  "message": "You stoking this ember shows others you felt it too."
}
```

**Notes:**
- Each user can stoke the same ember only once
- Stoking is the only reaction available (no replies, no judgments)
- Stoke counts are visible in the campfire view

---

### `/emocean campfire`

View multiple embers from the campfire at once.

**Syntax:**
```
/emocean campfire [--tag <tag>] [--limit <n>]
```

**Parameters:**
- `--tag <tag>` (optional): Filter by tag
- `--limit <n>` (optional): Number of embers to display (1-20, default: 12)

**Example:**
```
/emocean campfire              # View up to 12 recent embers
/emocean campfire --tag rant   # View recent rant embers
/emocean campfire --limit 5    # View 5 most recent embers
```

**Response:**
```json
{
  "embers": [
    {
      "id": "abc123",
      "message": "Finally fixed that race condition...",
      "username": "CosmicPenguin423",
      "location": "Somewhere on the US East Coast",
      "tag": "win",
      "stokes": 18,
      "created_at": "2026-03-15T08:30:00Z"
    },
    {
      "id": "def456",
      "message": "Debugging is like detective work for code...",
      "username": "NocturnalNinja92",
      "location": "Somewhere in East Asia",
      "tag": "struggle",
      "stokes": 5,
      "created_at": "2026-03-15T07:15:00Z"
    }
  ],
  "total": 2,
  "timestamp": "2026-03-15T10:00:00Z"
}
```

---

### `/emocean stats`

View campfire activity statistics.

**Syntax:**
```
/emocean stats
```

**Example:**
```
/emocean stats
```

**Response:**
```json
{
  "total_embers": 4521,
  "total_stokes": 12843,
  "active_developers": 287,
  "embers_last_24h": 156,
  "most_popular_tag": "struggle",
  "timestamp": "2026-03-15T10:00:00Z"
}
```

---

## How Skills Work Across Platforms

### Hermes Agent

Hermes is a CLI-based agent framework that discovers and invokes skills dynamically.

**Installation:**
```bash
hermes skills install 0xRaghu/emocean/skills/emocean
```

**Usage:**
```bash
hermes
> /emocean toss "Shipped something cool today!" --tag win
> /emocean catch --tag inspiration --count 3
> /emocean campfire
```

**How it works:**
1. Hermes parses the `SKILL.md` file
2. Extracts activation triggers and command syntax
3. Routes user input matching `/emocean <command>` to the skill handler
4. Invokes the appropriate API endpoint and returns the response

---

### Claude Code

Claude Code is Anthropic's CLI for Claude, supporting agent skills via skill invocation.

**Integration:**
When a user mentions context matching the activation triggers, Claude Code can:

1. Recognize the emotional context (isolation, frustration, celebration)
2. Suggest invoking the Emocean skill
3. Execute the appropriate command
4. Display the result to the user

**Example interaction:**
```
User: "I've been stuck on this bug for hours and feel so isolated."

Claude Code: "It sounds like you're having a tough time. Would you like to share
that feeling anonymously in the Emocean campfire? Other devs might relate."

> /emocean toss "Stuck on a bug for hours... feeling isolated." --tag struggle
> /emocean catch --tag gratitude
```

---

### Cursor

Cursor is an AI-first code editor with native agent support.

**Integration:**
Cursor can invoke Emocean skills in response to:
- User commands in the Cursor command palette
- Context detection (detecting emotional keywords in comments, terminal output)
- Direct slash commands in the chat interface

**Example:**
```
In Cursor chat:
> I'm so frustrated with this code!

Cursor suggestions:
- Toss an ember about this frustration
- Catch a random ember for perspective
- View the campfire
```

---

### OpenCode

OpenCode is an IDE wrapper with integrated agent systems.

**Integration:**
OpenCode parses SKILL.md files and exposes skills through:
- Command palette
- Context menus
- Inline suggestions
- Agent orchestration

---

## API Integration

The Emocean skill communicates with the backend API at:

```
https://api.emocean.dev
```

### Endpoints

| Endpoint | Method | Parameters | Returns |
|----------|--------|-----------|---------|
| `/toss` | POST | `message`, `tag`, `sender_id`, `timezone` | Ember object |
| `/catch` | GET | `tag` (opt), `count` (opt), `exclude` (opt) | Ember object or array |
| `/stoke` | POST | `ember_id` | Stoke confirmation |
| `/campfire` | GET | `tag` (opt), `limit` (opt) | Array of embers |
| `/stats` | GET | — | Statistics object |

### Implementation Details

**Rate Limiting:**
- Users can toss 1 ember per 60 seconds
- API returns `HTTP 429` if rate limit exceeded
- Wait time is returned in response headers

**Content Moderation:**
- URLs are blocked (prevent spam/scams)
- Profanity is filtered
- Messages over 280 characters are rejected
- Messages must be personal and kind

**Anonymous Identity:**
- Each user gets a persistent `sender_id` (UUID stored locally)
- Same sender always receives the same avatar and username
- No accounts or authentication required
- Timezone is converted to vague region names (e.g., "Somewhere in East Asia")

---

## Implementation Examples

### Toss Workflow

When a user expresses emotion (frustration, celebration, inspiration):

1. **Detect**: Recognize emotional context from user input
2. **Suggest**: "Want to share that with the campfire?"
3. **Collect**: Get message and optional tag from user
4. **Validate**: Ensure message ≤ 280 characters, tag is valid
5. **Generate**: Create/retrieve persistent `sender_id`
6. **Send**: POST to `/toss` with message, tag, sender_id, timezone
7. **Display**: Show confirmation with ember username and avatar

```python
def toss_ember(message: str, tag: str = None):
    sender_id = get_or_create_sender_id()
    timezone = get_user_timezone()

    payload = {
        "message": message[:280],
        "tag": tag or "idea",
        "sender_id": sender_id,
        "timezone": timezone
    }

    response = requests.post("https://api.emocean.dev/toss", json=payload)

    if response.status_code == 200:
        ember = response.json()["ember"]
        print(f"Ember tossed as {ember['username']} ({ember['location']})")
    elif response.status_code == 429:
        print("Rate limited. Wait 60 seconds before tossing again.")
```

### Catch Workflow

When a user wants perspective or connection:

1. **Request**: GET `/catch` with optional tag/count
2. **Display**: Show ember(s) with message, username, location, tag, stoke count
3. **Offer**: "Want to stoke this? Want another?"
4. **Iterate**: Let user catch more or view campfire

```python
def catch_ember(tag: str = None, count: int = 1):
    params = {}
    if tag:
        params["tag"] = tag
    if count > 1:
        params["count"] = min(count, 10)

    response = requests.get(
        "https://api.emocean.dev/catch",
        params=params
    )

    if response.status_code == 200:
        embers = response.json()
        if isinstance(embers, list):
            for ember in embers:
                display_ember(ember)
        else:
            display_ember(embers)
```

---

## Error Handling

### Common Issues and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `429 Too Many Requests` | Rate limit exceeded | Wait 60 seconds between tosses |
| `400 Bad Request` | Message too long | Limit to 280 characters |
| `400 Bad Request` | Invalid tag | Use only: win, struggle, idea, rant, gratitude, late-night |
| `400 Bad Request` | URL in message | Remove links; keep message personal |
| `500 Internal Server Error` | API down | Retry in 30 seconds; check status page |
| Empty campfire | No embers exist | Encourage user to toss first; try again in 5 minutes |
| Missing sender_id | Identity not persisted | Generate UUID and store locally for future requests |

---

## Skill Development & Distribution

### Creating a Skill Variant

To create a platform-specific variant (e.g., `hermes/`):

1. Create subdirectory: `skills/hermes/`
2. Copy or symlink base `SKILL.md`: `skills/hermes/SKILL.md`
3. Add platform-specific metadata section:

```yaml
metadata:
  hermes:
    tags: [community, social, anonymous, wellbeing]
    category: social
    required_env: [EMOCEAN_API_URL]
    rate_limit: "60s"
```

4. Document any platform-specific commands or behaviors
5. Test with the target platform

### Publishing Skills

To publish to agentskills.io registry:

1. Ensure SKILL.md follows standard format
2. Test all commands with your target platform
3. Add repository URL to metadata
4. Submit to agentskills.io registry
5. Pin a GitHub release with version tag

---

## Philosophy

Emocean exists because coding can be lonely. AI assistants are powerful, but sometimes you just want to know another human is out there, grinding through the same struggles and celebrating the same wins.

Every ember is a tiny reminder: **you're not alone in this.**

The campfire is ambient—no direct replies, no arguments, no judgment. Just warmth.

---

## Resources

- **Website**: https://emocean.dev
- **GitHub**: https://github.com/0xRaghu/emocean
- **API**: https://api.emocean.dev
- **agentskills.io**: https://agentskills.io (specification reference)

---

## Metadata

| Field | Value |
|-------|-------|
| **Created** | 2026-03-15 |
| **Last Updated** | 2026-03-15 |
| **Status** | Active |
| **Maintainer** | pilan-ai |
| **License** | MIT |

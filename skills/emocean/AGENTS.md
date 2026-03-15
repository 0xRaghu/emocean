<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# skills/emocean

## Purpose

Main Emocean skill definition in agentskills.io format. Compatible with Hermes, Claude Code, Cursor, and 30+ other AI agents.

## Key Files

| File | Description |
|------|-------------|
| `SKILL.md` | Complete skill definition with commands and API docs |

## For AI Agents

### Skill Metadata

```yaml
name: emocean
description: "Toss anonymous micro-messages into the developer campfire"
license: MIT
metadata:
  author: 0xRaghu
  version: "1.0.0"
  website: https://emocean.dev
```

### Commands

| Command | Description |
|---------|-------------|
| `/emocean toss "message" --tag <tag>` | Send an anonymous ember |
| `/emocean catch [--tag <tag>] [--count N]` | Receive random embers |
| `/emocean stoke <ember_id>` | React to an ember |
| `/emocean campfire` | View multiple embers |
| `/emocean stats` | View campfire statistics |

### Available Tags

`win` · `struggle` · `idea` · `rant` · `gratitude` · `late-night`

### API Base URL

`https://api.emocean.dev`

### When to Activate

- User feels isolated while coding
- User celebrates a win
- User wants to vent about code/bugs
- User has a random thought to share
- User mentions "campfire", "ember", "emocean"

<!-- MANUAL: -->

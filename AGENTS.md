<!-- Generated: 2025-03-15 -->

# Emocean

**Warmth in the age of AI coding** — A shared anonymous campfire for developers.

## Purpose

Emocean is a platform where developers can anonymously share micro-moments (embers) with each other. While coding alone at 3am, debugging, or shipping features nobody will see — developers toss embers into a shared campfire and catch glimpses of others doing the same.

## Key Files

| File | Description |
|------|-------------|
| `README.md` | Project overview, installation, and usage guide |
| `SKILL.md` | Agent skill definition (agentskills.io format) |
| `LICENSE` | MIT License |
| `.gitignore` | Git ignore patterns |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | Cloudflare Workers + D1 backend API (see `api/AGENTS.md`) |
| `mcp/` | MCP server for Claude Code/Desktop integration (see `mcp/AGENTS.md`) |
| `sdk/` | SDK placeholder for future client libraries (see `sdk/AGENTS.md`) |
| `site/` | Astro landing page at emocean.dev (see `site/AGENTS.md`) |
| `skills/` | Agent skills in agentskills.io format (see `skills/AGENTS.md`) |

## For AI Agents

### Working In This Repository

- **API Base URL**: `https://emocean-api.pilan.workers.dev`
- **Live Site**: `https://emocean.dev`
- Use the vocabulary: ember (message), toss (send), catch (receive), stoke (react), campfire (shared space)
- Embers are max 280 characters, anonymous, with optional tags

### Available Tags

`win` · `struggle` · `idea` · `rant` · `gratitude` · `late-night`

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/toss` | POST | Send a new ember |
| `/catch` | GET | Get random ember(s) |
| `/stoke` | POST | React to an ember ("I felt this") |
| `/campfire` | GET | Get multiple recent embers |
| `/stats` | GET | Get campfire statistics |

### Testing

- API tests: `cd api && pnpm test`
- Site preview: `cd site && pnpm dev`

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Cloudflare Workers + D1 (SQLite at edge) |
| Frontend | Astro + Tailwind CSS |
| MCP Server | Python + FastMCP |
| Skill Format | agentskills.io open standard |

## Philosophy

No accounts. No profiles. No likes. No replies. Just warmth.

<!-- MANUAL: -->

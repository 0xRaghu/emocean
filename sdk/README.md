# Emocean SDK

Client libraries for integrating Emocean into your applications.

## Status

**Planned for post-hackathon development.**

## Planned SDKs

| Language | Status | Description |
|----------|--------|-------------|
| **JavaScript/TypeScript** | Planned | npm package for Node.js and browser |
| **Python** | Planned | pip package with async support |
| **Swift** | Planned | SPM package for iOS/macOS apps |

## Current Options

For now, use one of these integration methods:

### MCP (Claude Code / Claude Desktop)

```bash
claude mcp add emocean -- uvx emocean-mcp
```

### Hermes Agent

```bash
hermes skills install 0xRaghu/emocean/skills/emocean
```

### Direct API

The REST API is available at `https://api.emocean.dev`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/toss` | POST | Send a new ember |
| `/catch` | GET | Get random ember(s) |
| `/stoke` | POST | Stoke an ember |
| `/campfire` | GET | Get multiple embers |
| `/stats` | GET | Get campfire statistics |

See [API documentation](../skills/AGENTS.md#api-integration) for details.

---

[Back to main README](../README.md)

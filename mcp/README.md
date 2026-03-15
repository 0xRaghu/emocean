# Emocean MCP Server

MCP (Model Context Protocol) server for Emocean — anonymous developer embers, glowing in the campfire.

## Tools

| Tool | Description |
|------|-------------|
| `toss_ember` | Toss an ember into the campfire (share anonymous message) |
| `catch_ember` | Catch random ember(s) from the campfire |
| `stoke_ember` | Stoke an ember (react: "I felt this") |
| `campfire_stats` | Get campfire statistics |

## Installation

### Option 1: uvx (Recommended - No Install Required)

Run directly from PyPI with `uvx`:

```bash
uvx emocean-mcp
```

### Option 2: pip Install

```bash
pip install emocean-mcp
emocean-mcp
```

### Option 3: Local Development

```bash
git clone https://github.com/0xRaghu/emocean.git
cd emocean/mcp
uv venv && source .venv/bin/activate
uv pip install -e .
emocean-mcp
```

## Usage with Claude for Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "emocean": {
      "command": "uvx",
      "args": ["emocean-mcp"]
    }
  }
}
```

## Usage with Claude Code

```bash
claude mcp add emocean -- uvx emocean-mcp
```

## Example Prompts

- "Toss an ember about my late-night debugging session"
- "Catch 3 embers tagged with #win"
- "Show me the campfire stats"
- "Stoke that ember, I felt it"

## Tags

Available tags: `win`, `struggle`, `idea`, `rant`, `gratitude`, `late-night`

---

## Also Available

**Hermes Agent**: `hermes skills install 0xRaghu/emocean/skills/emocean`

See [main README](../README.md) for full project details.

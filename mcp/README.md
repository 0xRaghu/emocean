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

```bash
cd mcp
uv venv
source .venv/bin/activate
uv pip install "mcp[cli]>=1.2.0" httpx
```

## Usage with Claude for Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "emocean": {
      "command": "uv",
      "args": [
        "--directory",
        "/Users/raghu/Projects/emocean-hackathon/mcp",
        "run",
        "emocean_server.py"
      ]
    }
  }
}
```

## Usage with Claude Code

```bash
claude mcp add emocean -- uv --directory /Users/raghu/Projects/emocean-hackathon/mcp run emocean_server.py
```

## Example Prompts

- "Toss an ember about my late-night debugging session"
- "Catch 3 embers tagged with #win"
- "Show me the campfire stats"
- "Stoke that ember, I felt it"

## Tags

Available tags: `win`, `struggle`, `idea`, `rant`, `gratitude`, `late-night`

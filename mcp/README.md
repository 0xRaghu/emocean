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

Run directly from GitHub with `uvx`:

```bash
uvx --from git+https://github.com/0xRaghu/emocean.git#subdirectory=mcp emocean-mcp
```

### Option 2: pip Install

```bash
pip install git+https://github.com/0xRaghu/emocean.git#subdirectory=mcp
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
      "args": [
        "--from",
        "git+https://github.com/0xRaghu/emocean.git#subdirectory=mcp",
        "emocean-mcp"
      ]
    }
  }
}
```

## Usage with Claude Code

```bash
claude mcp add emocean -- uvx --from git+https://github.com/0xRaghu/emocean.git#subdirectory=mcp emocean-mcp
```

## Example Prompts

- "Toss an ember about my late-night debugging session"
- "Catch 3 embers tagged with #win"
- "Show me the campfire stats"
- "Stoke that ember, I felt it"

## Tags

Available tags: `win`, `struggle`, `idea`, `rant`, `gratitude`, `late-night`

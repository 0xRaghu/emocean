"""
Emocean MCP Server
Anonymous developer embers, glowing in the campfire.

Tools:
- toss_ember: Toss an ember into the campfire
- catch_ember: Catch random ember(s) from the campfire
- stoke_ember: Stoke an ember (react: "I felt this")
- campfire_stats: Get campfire statistics
"""

import sys
import uuid
from typing import Any

import httpx
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("emocean")

# Constants
API_BASE = "https://emocean-api.pilan.workers.dev"
VALID_TAGS = ["win", "struggle", "idea", "rant", "gratitude", "late-night"]


async def make_request(
    method: str,
    endpoint: str,
    json_body: dict | None = None,
    params: dict | None = None
) -> dict[str, Any] | None:
    """Make a request to the Emocean API with proper error handling."""
    url = f"{API_BASE}{endpoint}"
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url, params=params, timeout=30.0)
            else:
                response = await client.post(url, json=json_body, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"API error: {e}", file=sys.stderr)
            return None


def format_ember(ember: dict) -> str:
    """Format an ember into a readable string."""
    tag_str = f"#{ember.get('tag')}" if ember.get('tag') else ""
    return f"""
"{ember.get('message', '')}"
— {ember.get('username', 'Anonymous')} {tag_str}
📍 {ember.get('location', 'Somewhere on Earth')} | 🔥 {ember.get('stokes', 0)} stokes
"""


@mcp.tool()
async def toss_ember(message: str, tag: str | None = None) -> str:
    """Toss an ember into the campfire - share an anonymous micro-message.

    Args:
        message: Your message (max 280 characters). Share wins, struggles, ideas, or late-night thoughts.
        tag: Optional tag to categorize your ember. One of: win, struggle, idea, rant, gratitude, late-night
    """
    if not message or len(message.strip()) == 0:
        return "Error: Message cannot be empty."

    if len(message) > 280:
        return f"Error: Message too long ({len(message)} chars). Maximum is 280 characters."

    if tag and tag not in VALID_TAGS:
        return f"Error: Invalid tag '{tag}'. Use one of: {', '.join(VALID_TAGS)}"

    # Generate a unique sender ID for this MCP session
    sender_id = f"mcp_{uuid.uuid4().hex[:16]}"

    data = await make_request("POST", "/toss", json_body={
        "message": message,
        "tag": tag,
        "sender_id": sender_id,
        "timezone": "UTC"
    })

    if not data:
        return "Failed to toss ember. API may be temporarily unavailable."

    if data.get("error"):
        return f"Error: {data['error']}"

    if data.get("ok"):
        ember = data.get("ember", {})
        return f"""✨ Ember tossed into the campfire!

Your ember is now glowing for developers around the world.
Username: {ember.get('username', 'Anonymous')}
Location: {ember.get('location', 'Somewhere on Earth')}

Someone, somewhere, will feel its warmth."""

    return "Unknown response from API."


@mcp.tool()
async def catch_ember(tag: str | None = None, count: int = 1) -> str:
    """Catch random ember(s) from the campfire - receive anonymous messages from other developers.

    Args:
        tag: Optional tag to filter embers. One of: win, struggle, idea, rant, gratitude, late-night
        count: Number of embers to catch (1-10, default 1)
    """
    if tag and tag not in VALID_TAGS:
        return f"Error: Invalid tag '{tag}'. Use one of: {', '.join(VALID_TAGS)}"

    count = max(1, min(10, count))

    params = {"count": str(count)}
    if tag:
        params["tag"] = tag

    data = await make_request("GET", "/catch", params=params)

    if not data:
        return "Failed to catch ember. API may be temporarily unavailable."

    if not data.get("ok"):
        return data.get("message", "No embers available.")

    # Single ember
    if count == 1:
        ember = data.get("ember")
        if not ember:
            return data.get("message", "The campfire is quiet right now. Toss an ember to get things started.")
        return f"🔥 Caught an ember:{format_ember(ember)}"

    # Multiple embers
    embers = data.get("embers", [])
    if not embers:
        return data.get("message", "The campfire is quiet right now.")

    result = f"🔥 Caught {len(embers)} ember(s):\n"
    for i, ember in enumerate(embers, 1):
        result += f"\n--- Ember {i} ---{format_ember(ember)}"

    return result


@mcp.tool()
async def stoke_ember(ember_id: str) -> str:
    """Stoke an ember - react to show you felt this message.

    Args:
        ember_id: The ID of the ember to stoke (from catch_ember response)
    """
    if not ember_id:
        return "Error: ember_id is required."

    data = await make_request("POST", "/stoke", json_body={"ember_id": ember_id})

    if not data:
        return "Failed to stoke ember. API may be temporarily unavailable."

    if data.get("error"):
        return f"Error: {data['error']}"

    if data.get("ok"):
        return f"🔥 Stoked! The ember now has {data.get('stokes', '?')} stokes. Your warmth was felt."

    return "Unknown response from API."


@mcp.tool()
async def campfire_stats() -> str:
    """Get statistics about the campfire - how many developers, embers, and stokes.
    """
    data = await make_request("GET", "/stats")

    if not data:
        return "Failed to get stats. API may be temporarily unavailable."

    if not data.get("ok"):
        return "Could not retrieve campfire statistics."

    stats = data.get("stats", {})
    tags = stats.get("tags", {})

    tag_breakdown = "\n".join([
        f"  #{tag}: {count}" for tag, count in tags.items() if count > 0
    ]) or "  No tagged embers yet"

    return f"""🏕️ Campfire Statistics

👥 Developers around the fire: {stats.get('unique_devs', 0)}
🔥 Total embers tossed: {stats.get('total_embers', 0)}
✨ Total stokes given: {stats.get('total_stokes', 0)}

📊 Embers by tag:
{tag_breakdown}

The campfire burns brighter with every ember."""


def main():
    """Initialize and run the MCP server."""
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()

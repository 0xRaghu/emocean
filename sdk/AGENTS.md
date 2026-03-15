<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# sdk

## Purpose

Placeholder directory for future Emocean client SDKs. Currently empty — the API is accessed directly via HTTP.

## Planned SDKs

| SDK | Status | Description |
|-----|--------|-------------|
| `emocean-js` | Planned | JavaScript/TypeScript client for web/Node |
| `emocean-py` | Planned | Python client library |
| `emocean-swift` | Planned | Swift client for iOS/macOS |

## For AI Agents

### Working In This Directory

This directory is a placeholder. When implementing SDKs:

1. Create a subdirectory for each language (e.g., `js/`, `python/`, `swift/`)
2. Follow the API contract documented in `api/AGENTS.md`
3. Include typed interfaces for Ember, Stats, and API responses
4. Implement rate limiting awareness (1 toss per 60 seconds)

### API Reference

See `../api/AGENTS.md` for complete endpoint documentation.

<!-- MANUAL: -->

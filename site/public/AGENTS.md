<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/public

## Purpose

Static assets served at the root of emocean.dev. Includes images, fonts, and well-known files.

## Key Files

| File | Description |
|------|-------------|
| `favicon.svg` | Site favicon |
| `og-image.png` | Open Graph social preview image |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `.well-known/` | Standard well-known files including skills manifest |

## For AI Agents

### .well-known/skills/

Contains the agentskills.io manifest for skill discovery:

```
.well-known/
└── skills/
    └── emocean/
        └── SKILL.md
```

This allows agents to discover the Emocean skill via:
```
https://emocean.dev/.well-known/skills/emocean/SKILL.md
```

### Adding Static Assets

1. Place files in this directory
2. Reference in HTML as `/filename.ext`
3. Astro copies to build output automatically

### Image Optimization

For images, prefer:
- SVG for icons and logos
- WebP for photos (with PNG fallback)
- Appropriate sizing for viewport

<!-- MANUAL: -->

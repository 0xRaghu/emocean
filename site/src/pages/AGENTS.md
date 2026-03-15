<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/src/pages

## Purpose

Astro page routes. Each `.astro` file becomes a route on the site.

## Key Files

| File | Description |
|------|-------------|
| `index.astro` | Main landing page at emocean.dev |

## For AI Agents

### index.astro Structure

The landing page has 5 main sections:

1. **Hero** — Tagline, description, CTA buttons
2. **Campfire Grid** — Live embers fetched from API with rotation
3. **Toss Form** — Anonymous message submission with tag selection
4. **Stats** — Real-time campfire statistics
5. **How It Works** — Feature explanation

### Live Campfire System

```javascript
// Fetches embers from API
const response = await fetch('https://emocean-api.pilan.workers.dev/campfire');

// Ember rotation every 5 seconds
setInterval(rotateNextCard, 5000);

// Random card replacement with fade animation
function rotateNextCard() {
  const indexToReplace = Math.floor(Math.random() * displayedEmbers.length);
  // Fade out old card, fade in new card
}
```

### API Integration

| Endpoint | Usage |
|----------|-------|
| `/campfire` | Initial ember load |
| `/stats` | Campfire statistics |
| `/toss` | Form submission |
| `/stoke` | React to ember |

<!-- MANUAL: -->

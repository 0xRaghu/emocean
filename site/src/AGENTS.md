<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/src

## Purpose

Source code for the Emocean landing page. Contains Astro pages, layouts, components, and styles.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `pages/` | Astro page routes (see `pages/AGENTS.md`) |
| `layouts/` | Page layout templates (see `layouts/AGENTS.md`) |
| `components/` | Reusable UI components (see `components/AGENTS.md`) |
| `styles/` | Global CSS and Tailwind styles (see `styles/AGENTS.md`) |
| `lib/` | Utility functions (see `lib/AGENTS.md`) |

## For AI Agents

### File Conventions

- `.astro` files for pages and layouts
- `.tsx` files for React components (if needed)
- `.css` files for styles
- `.ts` files for utilities

### Astro Component Structure

```astro
---
// Frontmatter (server-side JS)
import Component from './Component.astro';
const data = await fetch('...');
---

<!-- Template (HTML with expressions) -->
<div class="container">
  <Component prop={value} />
</div>

<style>
  /* Scoped styles */
</style>

<script>
  // Client-side JavaScript
</script>
```

<!-- MANUAL: -->

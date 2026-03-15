<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/src/layouts

## Purpose

Astro layout templates that wrap page content with common HTML structure.

## Key Files

| File | Description |
|------|-------------|
| `Layout.astro` | Base HTML layout with head, header, background, footer |

## For AI Agents

### Layout.astro Structure

```astro
<!DOCTYPE html>
<html>
<head>
  <!-- Meta tags, fonts, styles -->
</head>
<body>
  <Header />
  <BackgroundEffects />
  <main>
    <slot /> <!-- Page content injected here -->
  </main>
  <Footer />
</body>
</html>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Page title (default: "Emocean") |
| `description` | string | Meta description |

### Usage in Pages

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Emocean - Warmth in AI Coding">
  <section>Page content</section>
</Layout>
```

<!-- MANUAL: -->

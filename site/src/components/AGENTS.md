<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/src/components

## Purpose

Reusable UI components for the Emocean landing page.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `ui/` | Base UI primitives (see `ui/AGENTS.md`) |

## For AI Agents

### Component Patterns

Components in this directory follow Astro conventions:

```astro
---
// Props interface
interface Props {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const { variant = 'default', size = 'md' } = Astro.props;
---

<button class:list={[variant, size]}>
  <slot />
</button>
```

### Adding New Components

1. Create `.astro` file in this directory
2. Define props interface in frontmatter
3. Use `<slot />` for children
4. Import in pages/layouts as needed

<!-- MANUAL: -->

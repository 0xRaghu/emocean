<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/src/components/ui

## Purpose

Base UI primitives, following shadcn/ui patterns adapted for Astro.

## Key Files

| File | Description |
|------|-------------|
| `button.tsx` | Button component with variants |

## For AI Agents

### Button Component

```tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}
```

### Variants

| Variant | Style |
|---------|-------|
| `default` | Solid ember-colored background |
| `outline` | Transparent with ember border |
| `ghost` | Transparent, subtle hover |

### Usage

```astro
---
import { Button } from '@/components/ui/button';
---

<Button variant="default" size="lg">
  Toss an Ember
</Button>
```

<!-- MANUAL: -->

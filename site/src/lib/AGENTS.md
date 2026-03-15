<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/src/lib

## Purpose

Utility functions and helpers for the Emocean site.

## Key Files

| File | Description |
|------|-------------|
| `utils.ts` | Common utility functions |

## For AI Agents

### Available Utilities

```typescript
// Class name merger (for Tailwind)
export function cn(...inputs: ClassValue[]): string;

// Format relative time
export function timeAgo(date: Date): string;

// Truncate text with ellipsis
export function truncate(str: string, length: number): string;
```

### Usage

```astro
---
import { cn, timeAgo } from '@/lib/utils';

const classes = cn('base-class', conditional && 'conditional-class');
const relative = timeAgo(new Date(ember.created_at));
---
```

### Adding New Utilities

Keep utilities pure and focused:
- One function per concern
- No side effects
- TypeScript for type safety
- Export from `utils.ts` barrel

<!-- MANUAL: -->

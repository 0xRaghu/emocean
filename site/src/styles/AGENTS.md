<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# site/src/styles

## Purpose

Global CSS styles and Tailwind configuration for the Emocean landing page.

## Key Files

| File | Description |
|------|-------------|
| `global.css` | Global styles, animations, ember card styles |

## For AI Agents

### Design Tokens

```css
/* Background */
--bg-dark: #0a0a12;
--bg-card: rgba(30, 25, 22, 0.95);

/* Ember accents */
--ember-primary: #ff6b35;
--ember-secondary: #ff8c42;
--ember-glow: rgba(255, 107, 53, 0.3);

/* Tag colors */
--tag-win: green
--tag-struggle: amber
--tag-idea: purple
--tag-rant: red
--tag-gratitude: pink
--tag-late-night: blue
```

### Key Animations

| Animation | Duration | Purpose |
|-----------|----------|---------|
| `twinkle` | 3s | Star background effect |
| `ember-rise` | 8s | Floating particle effect |
| `card-fade-out` | 1.2s | Card exit transition |
| `card-fade-in` | 1.5s | Card enter transition |
| `card-glow` | 4s | Subtle glow pulse |

### Ember Card Styling

```css
.ember-card {
  background: linear-gradient(135deg, rgba(30, 25, 22, 0.95), rgba(20, 18, 16, 0.9));
  border: 1px solid rgba(255, 140, 66, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(12px);
}

.ember-card:hover {
  border-color: rgba(255, 140, 66, 0.4);
  transform: translateY(-2px);
}
```

### Masonry Grid

```css
.campfire-grid {
  column-count: 3;  /* Desktop */
  column-gap: 1.5rem;
}

@media (max-width: 1024px) { column-count: 2; }
@media (max-width: 640px) { column-count: 1; }
```

<!-- MANUAL: -->

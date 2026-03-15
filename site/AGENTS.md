# Emocean Site Architecture

An Astro landing page for emocean.dev, a platform for anonymous micro-messages from developers gathered around a virtual campfire.

## Project Structure

```
site/
├── src/
│   ├── pages/
│   │   └── index.astro          # Main landing page with live campfire
│   ├── layouts/
│   │   └── Layout.astro         # Base HTML layout with header, footer, background
│   ├── styles/
│   │   └── global.css           # Tailwind + custom CSS animations
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx       # shadcn button component
│   └── lib/
│       └── utils.ts             # Utility functions (class merging)
├── public/
│   ├── .well-known/skills/      # Agent skill manifest
│   ├── favicon.ico
│   ├── icon-192.png & icon-512.png
│   ├── apple-touch-icon.png
│   └── logo.png
├── astro.config.mjs             # Astro configuration with Tailwind
├── tailwind.config.mjs           # Tailwind CSS configuration
└── package.json                 # Dependencies (Astro, React, Tailwind, shadcn)
```

## Core Pages & Layouts

### src/pages/index.astro
The main landing page with five sections:

1. **Hero Section** (`#hero`)
   - Animated title "Emocean" with wave underline animation
   - Call-to-action buttons: "Toss an Ember" and "Sit by the Campfire"
   - Scroll indicator with pulsing animation

2. **Campfire Section** (`#campfire`)
   - Masonry grid that displays live ember cards from the API
   - Fetches from `https://emocean-api.pilan.workers.dev/campfire?limit=24`
   - Cards rotate every 5 seconds with smooth fade animations
   - Initially displays 12 cards in a 3-column responsive layout

3. **Toss Form Section** (`#toss`)
   - Textarea for message input (max 280 characters)
   - Character counter with color warnings (amber at 220+, red at 260+)
   - Six tag buttons (optional): `#win`, `#struggle`, `#idea`, `#rant`, `#gratitude`, `#late-night`
   - Submit button disabled until message is entered
   - Success message with glowing animation after submission
   - Posts to `https://emocean-api.pilan.workers.dev/toss`

4. **Stats Section** (`#stats`)
   - Animated number counters for:
     - Unique developers around the fire
     - Total embers tossed
     - Total stokes given (likes)
   - Fetches from `/stats` endpoint
   - Numbers animate in when scrolled into view

5. **How It Works Section** (`#how`)
   - Three-card layout explaining the process
   - Install skill command, toss embers, catch embers

### src/layouts/Layout.astro
Base HTML layout that wraps all pages:

- **Header**: Fixed navigation with links to Campfire, Toss, How It Works
- **Background System**:
  - Ocean gradient (radial blend of ember colors fading into deep ocean)
  - 40-80 twinkling stars (responsive count)
  - 15-30 floating ember particles with rise animation
  - Two animated wave layers at bottom for ocean effect
- **Footer**: Links to GitHub and Twitter, hackathon attribution
- **Font Loading**: JetBrains Mono, Changa One, General Sans from Google Fonts

## Styling System

### src/styles/global.css

**Design Tokens** (CSS Custom Properties):
- **Background**: `--bg-deep` (#0a0e14), `--bg-mid` (#0d1420), `--bg-surface` (#111a28)
- **Campfire/Accents**: `--ember` (#ff6b35), `--ember-bright` (#ff8c42), `--warmth` (#ffa94d)
- **Text**: `--text` (#f0f0f0), `--text-muted` (#8899a8), `--text-dim` (#4a5a6a)
- **Tag Colors**: win (#10b981), struggle (#f59e0b), idea (#3b82f6), rant (#ef4444), gratitude (#ec4899), late-night (#a855f7)

**Key Animations**:
- `twinkle`: 3s fade in/out for background stars
- `ember-rise`: 5-10s particles rising from bottom with scale fade
- `wave-drift`: 14-18s ocean wave animation (alternate directions)
- `wave-flow`: 3s side-to-side flow for title underline
- `fade-pulse`: 2s scroll indicator pulse
- `glow-pulse`: 1.5s radial scale+opacity for success state
- `card-float-1/2/3`: 8-12s gentle floating animations per column
- `card-glow`: 6-8s box-shadow pulse
- `card-fade-out/in`: 1.2-1.5s cards fading for rotation

**Ember Card Styling**:
- Dark gradient background (135deg, rgba values for depth)
- 1px border with ember color at low opacity
- 1rem rounded corners with backdrop blur
- Subtle inner glow with inset box-shadow
- Hover: enhanced glow, lifted transform
- No animations on hover (animation-play-state paused)

**Masonry Grid**:
- CSS multi-column layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- 2rem gaps between columns
- Cards use `break-inside: avoid` for proper column flow
- Responsive breakpoints: max-width 1024px (2 cols), max-width 640px (1 col)

**Tailwind Integration**:
- `@import "tailwindcss"` for base framework
- `@import "tw-animate-css"` for animation utilities
- `@import "shadcn/tailwind.css"` for component styles
- Custom Tailwind config with theme colors, fonts, and radius

## Live Campfire System

### Ember Pool & Rotation

The campfire fetches real embers from an API and rotates them smoothly:

**Initialization** (`initCampfire` function):
1. Fetch 24 embers from `/campfire?limit=24` endpoint
2. Display first 12 in the masonry grid
3. Pool remaining 12 as candidates for rotation
4. Start rotation loop after 3-second delay

**Card Rotation** (`rotateNextCard` function):
- Every 5 seconds, one random card is replaced
- Selection algorithm:
  1. Pick random displayed card to replace
  2. Pick random unused ember from pool
  3. Fade out old card (1.2s `card-fade-out`)
  4. Replace DOM element
  5. Fade in new card (1.5s `card-fade-in`)
  6. Return old ember back to available pool
- Repeats indefinitely with smooth transitions

**Ember Card Structure**:
```
<article class="ember-card" data-ember-id="...">
  <header>
    <div class="ember-user">
      <img class="ember-avatar" src="..." />
      <span class="ember-username">dev_name</span>
    </div>
    <span class="ember-tag" data-tag="win">#win</span>
  </header>
  <p class="ember-message">Message text...</p>
  <footer>
    <span class="ember-location">Location</span>
    <button class="stoke-btn" data-id="...">
      <svg>🔥</svg>
      <span>42</span>
    </button>
  </footer>
</article>
```

**Auto-Animate Integration**:
- Masonry grid uses `@formkit/auto-animate` for smooth DOM transitions
- 400ms duration, ease-out timing
- Handles card replacements without jarring layout shifts

### API Endpoints

All endpoints point to: `https://emocean-api.pilan.workers.dev`

**GET /campfire**
- Query: `?limit=24` (or other number)
- Returns: `{ ok: true, embers: [...] }`
- Ember object: `{ id, username, avatar_url, message, tag, stokes, location, location_label }`

**GET /stats**
- Returns: `{ ok: true, stats: { unique_devs, total_embers, total_stokes } }`

**POST /toss**
- Body: `{ message, tag, sender_id, timezone }`
- Returns: `{ ok: true, ember: { id, username, avatar_url, location } }` or error with rate-limit message
- Sender ID: stored in localStorage as `emocean_sender_id`; auto-generated as `web_${UUID}` on first visit

**POST /stoke**
- Body: `{ ember_id }`
- Increments stoke count for an ember

### Dynamic User State

**Character Counter**:
- Updates as user types in textarea
- Shows "0 / 280" format
- Turns amber at 220+ characters, red at 260+

**Tag Selection**:
- Single-select toggle buttons
- Active state: colored background + border + text
- Optional (form submits without tag)

**Form State Management**:
- Submit button disabled until message has content
- "Tossing..." state during submission
- 4-second success animation, then form resets
- New tossed ember added to pool immediately for next rotation

## Component Library

### src/components/ui/button.tsx
shadcn button component (React). Exported but not extensively used on landing page.

### src/lib/utils.ts
Utility functions, primarily `cn()` for merging Tailwind class names.

## Configuration

### astro.config.mjs
```javascript
- integrations: [@astrojs/react] for React component support
- vite plugins: [@tailwindcss/vite] for Tailwind v4 with Vite
```

### tailwind.config.mjs
Tailwind v4 configuration with:
- Custom color palette (ember, warmth, ocean grays)
- Font families (JetBrains Mono, Changa One, General Sans)
- Border radius scales
- Animation utilities

## Development

**Install**:
```bash
pnpm install
```

**Dev Server**:
```bash
pnpm dev
# Runs on http://localhost:3000
```

**Build**:
```bash
pnpm build
# Outputs to dist/ folder
```

**Preview**:
```bash
pnpm preview
# Test production build locally
```

## Browser Support

- Modern browsers with CSS Grid, Flexbox, CSS Columns
- CSS Variables (custom properties)
- `fetch` API for real-time ember loading
- `localStorage` for sender ID persistence
- `IntersectionObserver` for stats animation trigger
- Reduced motion media query support

## Performance Considerations

1. **Lazy Loading**: Embers fetched on page load, not pre-rendered
2. **Masonry Layout**: CSS columns avoid expensive JavaScript layout
3. **Auto-Animate**: Detects DOM changes and applies smooth transitions
4. **Intersection Observer**: Stats animation only runs when scrolled into view
5. **Request Animation Frame**: Number counter uses RAF for smooth animation
6. **LocalStorage**: Sender ID persisted to reduce redundant data

## Accessibility

- Semantic HTML: `<article>`, `<header>`, `<footer>`, `<section>`
- Reduced motion media query respects user preferences
- Color contrast: text on dark backgrounds meets WCAG standards
- Tabindex and keyboard navigation for buttons and forms
- ARIA labels on image elements

## Skill Integration

The site exposes a Hermes agent skill manifest at `/.well-known/skills/emocean/SKILL.md` allowing developers to install the emocean skill via:

```bash
hermes skills install 0xRaghu/emocean/skills/emocean
```

This enables command-line interaction with the campfire directly from Hermes agent terminals.

## Notable Implementation Details

1. **Wave SVG**: Animated wave underline on title uses gradient stroke with phase animation
2. **Ember Particles**: Rising particles use random delay and duration for organic feel
3. **Card Glow**: Each column offset with staggered animation start times (0s, 2s, 4s)
4. **Floating Effect**: Different animation curves per column (3n+1, 3n+2, 3n) for visual variation
5. **Form Validation**: Tag selection is optional; message-only submission is valid
6. **Error Handling**: Rate-limit errors treated as success (display 4s success message anyway)
7. **Empty State**: Shows when no embers available, with CTA to toss first ember
8. **Dark Mode**: Forced via `<html class="dark">` (no light theme toggle)

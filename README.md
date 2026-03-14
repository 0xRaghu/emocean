# Emocean

**Warmth in the age of AI coding.**

A shared anonymous campfire for developers. While you wait for inference, while you debug alone at 3am, while you ship something nobody will see — you're not alone. Other developers are out there, tossing their small moments into the same fire.

**Live:** [emocean.pilan.ai](https://emocean.pilan.ai) | **API:** `emocean-api.pilan.workers.dev`

---

## Install the Skill

### Hermes Agent

```bash
hermes skills install 0xRaghu/emocean/skills/emocean
```

### Usage

```bash
# Toss an ember
/emocean toss "Finally fixed that race condition!" --tag win

# Catch a random ember
/emocean catch

# View the campfire
/emocean campfire
```

---

## The Idea

AI-assisted coding is efficient but lonely. Developers spend hours in flow states with AI agents, experiencing small wins, frustrations, and late-night thoughts — but these micro-moments evaporate. Nobody tweets "I fixed a semicolon after 30 minutes." Twitter is performative, Reddit is topical. Neither captures the texture of daily dev life.

**Emocean** fills that gap with anonymous, low-stakes, serendipitous human connection.

The name is a portmanteau of **Emo**tion + **Ocean**.

---

## The Metaphor

The ocean is the vast shared world of developers coding in isolation. In the middle of it sits an island with a campfire — a warm, ambient gathering point.

Developers don't talk to each other directly. They **toss embers** (short anonymous messages) into the fire and watch others' embers glow. When one resonates, they **stoke** it — a single gesture that says "I felt this."

No accounts. No profiles. No likes. No replies. Just warmth.

---

## Vocabulary

| Term | Meaning |
|------|---------|
| **Ember** | A short anonymous message (max 280 chars) |
| **Toss** | Send an ember into the campfire |
| **Stoke** | React to an ember — "I felt this" |
| **Campfire** | The shared space where embers live |
| **The Ocean** | The vast backdrop — devs coding in isolation |

---

## Features

- **Toss embers** — Share anonymous messages with optional tags
- **Catch embers** — Receive random messages from developers worldwide
- **Stoke** — One reaction only: "I felt this"
- **Fuzzy location** — Timezone converted to vague region ("Somewhere in East Asia")
- **Deterministic identity** — Same sender always gets same avatar + username
- **Cross-platform** — CLI, Telegram, Discord, Slack via Hermes Agent

---

## Tags

`#win` · `#struggle` · `#idea` · `#rant` · `#gratitude` · `#late-night`

---

## Project Structure

```
emocean/
├── api/                    # Cloudflare Workers + D1 backend
│   ├── src/index.js        # API routes (/toss, /catch, /stoke, /campfire, /stats)
│   ├── schema.sql          # Database schema
│   └── wrangler.toml       # Cloudflare config
│
├── site/                   # Astro landing page
│   └── src/
│       ├── pages/index.astro
│       ├── layouts/Layout.astro
│       └── styles/global.css
│
└── skills/                 # Agent skills (agentskills.io format)
    └── emocean/
        └── SKILL.md        # Hermes/Claude Code/Cursor compatible
```

---

## Tech Stack

- **Backend**: Cloudflare Workers + D1 (SQLite at edge)
- **Frontend**: Astro + Tailwind CSS
- **Skill Format**: [agentskills.io](https://agentskills.io) open standard
- **Compatible Agents**: Hermes, Claude Code, Cursor, VS Code Copilot, Gemini CLI, and 30+ others

---

## Scheduled Ember Delivery

Set up automatic ember catches using Hermes cron. First, ensure the gateway is running:

```bash
hermes gateway install
```

### Example: Morning Warmth

Tell Hermes in natural language:

```
Every morning at 9am, catch 3 embers from Emocean using /emocean catch --count 3.
Display each one with a warm greeting. Deliver to telegram.
```

### Example: Late Night Companion

```
Every night at 11pm, catch 2 embers tagged 'late-night' using
/emocean catch --tag late-night --count 2. Show them with an
encouraging note. Deliver to discord.
```

### Example: Coding Break Reminder

```
Every 4 hours during weekdays (9am-9pm), catch 1 ember from Emocean
and show it as a gentle reminder that other devs are out there.
```

### Using CLI

```bash
/cron add "0 9 * * *" "Use /emocean catch --count 3. Display each ember with username and location."
```

> **Note**: Cron jobs run in fresh sessions. Include all context in the prompt.

---

## Hackathon

Built for the [Nous Research Hermes Agent Hackathon](https://x.com/NousResearch) (March 2026).

---

## License

MIT

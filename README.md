# Emocean

**Warmth in the age of AI coding.**

A shared anonymous campfire for developers. While you wait for inference, while you debug alone at 3am, while you ship something nobody will see — you're not alone. Other developers are out there, tossing their small moments into the same fire.

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
├── api/                # Cloudflare Workers backend
│   ├── src/
│   │   └── index.js
│   ├── schema.sql
│   └── wrangler.toml
│
├── web/                # Landing page
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── sdk/                # Python client (agent-agnostic)
│   └── emocean.py
│
└── skills/             # Agent-specific integrations
    └── hermes/
        └── SKILL.md
```

---

## Tech Stack

- **Backend**: Cloudflare Workers + D1 (SQLite at edge)
- **Frontend**: Vanilla HTML/CSS/JS
- **SDK**: Python (stdlib only, zero dependencies)
- **Integrations**: Hermes Agent skill

---

## Hackathon

Built for the [Nous Research Hermes Agent Hackathon](https://x.com/NousResearch) (March 2026).

---

## License

MIT

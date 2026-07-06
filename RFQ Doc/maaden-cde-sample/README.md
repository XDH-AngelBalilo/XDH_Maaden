# Maaden ARGP — CDE Asset Data Backbone (Localhost Sample)

Demo of Module **M1 (CDE + Engineering Data Hub)** — Master Data Registry + Data Template governance — for the Maaden ARGP pursuit.
Refs: SoW ARGP-DIGI-APP-SOW-001 | Master Roadmap XDH-AE-Q26-05-00030.

**Start here: read `CLAUDE.md`** — it contains the full build brief, conventions, demo story and rules.

## Contents
| Path | What |
|---|---|
| `CLAUDE.md` | Build brief for Claude Code — the contract for all work |
| `db/schema.sql` | Postgres DDL (library, plant, governance) |
| `db/seed/seed.sql` | Demo dataset — the 4-asset "Pump Package story" |
| `docker-compose.yml` | Postgres 16 on :5432 |
| `.env.example` | Copy to `.env.local` |
| `docs/CDE Backbone - Implementation Plan.md` | Full plan (roadmap-aligned rev 1) |
| `docs/CDE Backbone - UI Layout.html` | Target UI — open in a browser, build to match |
| `docs/demo-script.md` | 10-minute client walkthrough |
| `docs/vision/` | Maaden's 4 vision diagrams |

## Quick start
```bash
docker compose up -d
# scaffold Next.js app here (see CLAUDE.md build order S1)
npm install && npm run db:reset && npm run dev
```

## First prompt to give Claude Code
> Read CLAUDE.md and docs/CDE Backbone - Implementation Plan.md. Open docs/CDE Backbone - UI Layout.html to understand the target screens. Then execute build step S1: scaffold the Next.js 14 + TypeScript + Tailwind app in this folder, wire docker-compose Postgres, implement `npm run db:reset` (applies db/schema.sql then db/seed/seed.sql), and verify the seed loads. Stop after S1 and show me the result.

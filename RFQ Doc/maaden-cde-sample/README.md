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

## Quick start (Docker)
```bash
docker compose up -d              # postgres 16 on :5432
npm install
cp .env.example .env.local
npm run db:reset                  # applies db/schema.sql + db/seed/seed.sql
npm run dev                       # app on :3000
```

## Quick start (Windows, no Docker — portable Postgres)
Postgres 16 portable binaries live in `C:\XDH_Maaden\.tools\pgsql` (gitignored; from
https://get.enterprisedb.com/postgresql/postgresql-16.9-2-windows-x64-binaries.zip).

```powershell
# one-time init (already done on this machine):
#   .tools\pgsql\bin\initdb -D .tools\pgsql\data_maaden -U postgres -A trust
#   psql -U postgres -c "CREATE ROLE cde LOGIN PASSWORD 'cde_local_dev';"
#   psql -U postgres -c "CREATE DATABASE maaden_cde OWNER cde;"
C:\XDH_Maaden\.tools\pgsql\bin\pg_ctl -D C:\XDH_Maaden\.tools\pgsql\data_maaden start
npm install ; npm run db:reset ; npm run dev
```

## Build status (per CLAUDE.md build order)
- ✅ S1 scaffold + DB (Next.js 14, Tailwind, `db:reset`)
- ✅ S2 REST API `/api/v1/*` + OpenAPI at `/api/v1/openapi.json`
- ✅ S3 validation engine — 3 rule families, lifecycle transitions
- ✅ S4 screens 1–4 (Dashboard, Template Library, Registry, Asset Detail)
- ✅ S5 screens 5–7 (Compliance, Publish Hub, Governance) + publish simulator
- ✅ S6 demo arc verified end-to-end (fails → fixes → 100% pass → hero published)
- ✅ S7 AI (standards RAG + datasheet auto-classification) — Claude API (`claude-opus-4-8`), degrades gracefully with empty `ANTHROPIC_API_KEY` (AI screen shows disabled state; routes return 503). See `/ai`.

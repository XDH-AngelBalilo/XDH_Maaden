# syntax=docker/dockerfile:1.6
# ─────────────────────────────────────────────────────────────────────────────
# Maaden ARGP CDE sample — production image
#
# The app ran only as `npm run dev` against a Postgres on the developer's own
# machine, which is why the XDHouse.AI Apps card could not open it for anyone
# but that developer. This builds it into an image the VPS can run alongside
# the platform, behind the same Cloudflare Tunnel and Access policies.
#
# Not a workspace project, unlike apps/web in the platform repo, so the
# lockfile and the source sit in the same directory and the standalone
# entrypoint is a plain /app/server.js.
#
#   1. deps    — install production + build dependencies
#   2. builder — `next build` with output: "standalone"
#   3. runner  — the slim standalone tree on node:20-alpine
#
# The database is a separate service. This image carries no data and can be
# rebuilt and replaced freely; everything durable lives in the Postgres
# volume beside it.
#
# Build (from this directory):
#   docker build -t ghcr.io/xdh-angelbalilo/maaden-cde:latest .
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# npm ci when a lockfile is present, npm install when it is not. The sample
# has one; the fallback keeps the build working if it is ever regenerated.
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    else npm install --no-audit --no-fund; fi

# ── Stage 2: builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ARG GIT_SHA=unknown
ARG BUILT_AT=unknown

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MAADEN_GIT_SHA=${GIT_SHA} \
    MAADEN_BUILT_AT=${BUILT_AT}

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
# No public/ directory here, unlike most Next apps and unlike the platform's
# apps/web. COPY has no conditional form and fails the build outright on a
# missing source, so this is an absence to respect rather than paper over.
# If static assets are ever added, restore:
#   COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# The schema and seed travel with the image so the database can be built or
# reset from a running container. They are read by scripts/db-reset.mjs at
# runtime, so Next's output tracer never sees them and would otherwise leave
# them out of the standalone tree.
COPY --from=builder --chown=nextjs:nodejs /app/db               ./db
COPY --from=builder --chown=nextjs:nodejs /app/scripts          ./scripts

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]

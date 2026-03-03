# ── Stage 1: Install dependencies ──────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/
RUN npm ci --workspace=apps/web --include-workspace-root

# ── Stage 2: Build ─────────────────────────────────────────
FROM deps AS builder
WORKDIR /app
COPY tsconfig.base.json ./
COPY apps/web/ apps/web/
ENV NEXT_TELEMETRY_DISABLED=1
ARG BACKEND_URL=http://api:3001
ENV BACKEND_URL=${BACKEND_URL}
RUN npm run build --workspace=apps/web

# ── Stage 3: Runner ────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["node", "apps/web/server.js"]

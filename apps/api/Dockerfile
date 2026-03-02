# ── Stage 1: Install dependencies ──────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
RUN npm ci --workspace=apps/api --include-workspace-root

# ── Stage 2: Build ─────────────────────────────────────────
FROM deps AS builder
WORKDIR /app
COPY tsconfig.base.json ./
COPY apps/api/ apps/api/
RUN npm run build --workspace=apps/api

# ── Stage 3: Production dependencies only ──────────────────
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
RUN npm ci --workspace=apps/api --include-workspace-root --omit=dev

# ── Stage 4: Runner ────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

COPY --from=prod-deps --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=prod-deps --chown=nestjs:nestjs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/package.json ./apps/api/

USER nestjs

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]

# Konstytucja: Spark Test Project

> Wersja: 1.0.0 | Marzec 2026

## Core Principles

### I. Architektura monorepo

Projekt MUSI zachować strukturę monorepo z npm workspaces:
- `apps/web` — Next.js 15 (App Router, port 3000)
- `apps/api` — NestJS 11 (REST API, port 3001)
- `packages/` — Współdzielone biblioteki
- NIE importuj bezpośrednio między apps/api i apps/web
- Współdzielone typy/logika → `packages/`

### II. Backend (NestJS)

Każdy zasób = osobny moduł NestJS:
- Logika biznesowa MUSI być w serwisach, NIE w kontrolerach
- Walidacja MUSI używać class-validator w DTO
- Każdy endpoint MUSI mieć Swagger dekoratory (@ApiOperation, @ApiResponse)
- Entity: UUID PK + CreateDateColumn + UpdateDateColumn
- Wyjątki: wbudowane NestJS (NotFoundException, BadRequestException)
- NIE używaj `synchronize: true` na produkcji — migracje TypeORM
- NIE usuwaj fizycznie rekordów na produkcji — soft delete (wyjątek: fizyczny delete dozwolony w fazie MVP, przed wdrożeniem audytu)

### III. Frontend (Next.js)

- State management: Redux Toolkit z createAsyncThunk
- API calls: Axios przez services/api.ts (next.config.ts rewrites)
- UI: MUI 6 + Tailwind CSS 4 + Emotion
- `'use client'` TYLKO gdy potrzebne (hooks, events, Redux)
- Brak bezpośrednich fetch() do API — zawsze przez serwis

### IV. TypeScript

- NIE używaj `any` — pełne typowanie
- NIE hardcoduj konfiguracji — process.env / ConfigModule
- Preferuj interface nad type (dla obiektów)
- Path alias `@/` w frontend

### V. Testowanie (NON-NEGOTIABLE)

Wszystkie nowe funkcjonalności MUSZĄ mieć testy:
- Backend unit: mockowany repository, test serwisów (Jest)
- Backend E2E: Supertest na kontrolerach
- Frontend: Testing Library na komponentach
- `npm test` MUSI przechodzić przed merge
- `npm run lint --workspaces --if-present` bez błędów

## Technical Constraints

### Środowisko

- Dev: `docker compose -f docker-compose.dev.yml up -d` (hot-reload)
- Prod: `docker compose up -d` (multi-stage builds)
- Baza danych ZAWSZE przez Docker (MariaDB 11)
- Zmienne env: `.env` (gitignore), `.env.example` (w repo)

### Komendy

```bash
npm run dev              # Oba serwisy
npm test                 # Wszystkie testy
npm run lint --workspaces --if-present
npm run build
npm run docker:dev       # Docker z hot-reload
```

## Development Workflow

### Spec-Driven Development (spec-kit)

1. `/speckit.constitution` — zasady (ten plik)
2. `/speckit.specify` — specyfikacja
3. `/speckit.clarify` — wyjaśnienia (opcjonalnie)
4. `/speckit.plan` — plan techniczny
5. `/speckit.tasks` — lista zadań
6. `/speckit.implement` — implementacja

### Dokumentacja

- DZIENNIK_ZMIAN.md: wpis po KAŻDEJ sesji
- CLAUDE.md: aktualizuj gdy dodajesz moduły/endpointy
- Swagger: http://localhost:3001/docs

## Governance

- Ta konstytucja zastępuje inne praktyki rozwojowe
- Zmiany wymagają dyskusji i aktualizacji wersji
- Wszystkie PR muszą weryfikować zgodność z tą konstytucją
- Złożoność musi być uzasadniona w planie technicznym

**Version**: 1.0.0 | **Ratified**: 2026-03-02 | **Last Amended**: 2026-03-02

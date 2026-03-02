# Spark Test Project - Kontekst dla Claude Code

> **Wersja dokumentacji:** 1.0 | Marzec 2026

## TL;DR (Przeczytaj najpierw)

**Co to jest**: Full-stack monorepo Todo App - Next.js frontend + NestJS API + MariaDB.

**Stack technologiczny**: Next.js 15, React 19, NestJS 11, TypeORM 0.3, MariaDB 11, TypeScript 5.7, Redux Toolkit, MUI 6, Tailwind CSS 4, Docker

**Struktura monorepo** (npm workspaces):
- `apps/web` - Frontend (Next.js 15, App Router, port 3000)
- `apps/api` - Backend (NestJS 11, port 3001)
- `packages/` - Współdzielone biblioteki (puste, gotowe do użycia)

**Krytyczne zasady**:
1. Logika biznesowa w serwisach NestJS, NIE w kontrolerach
2. Walidacja DTO przez `class-validator` na każdym endpoincie
3. Swagger dekoratory (`@ApiOperation`, `@ApiResponse`) na każdym endpoincie
4. DZIENNIK_ZMIAN.md - po zakończeniu sesji dodaj wpis
5. NIE używaj `any` - zawsze typuj

---

## Aktualne blokery / Znane problemy

Brak znanych blokerów.

---

## Struktura projektu

```
spark_test_project/
├── apps/
│   ├── api/                          # NestJS 11 backend
│   │   ├── eslint.config.mjs         # ESLint 9 flat config (typescript-eslint)
│   │   └── src/
│   │       ├── main.ts               # CORS, ValidationPipe, Swagger
│   │       ├── app.module.ts          # TypeORM config, moduły
│   │       ├── data-source.ts         # TypeORM CLI DataSource (migracje)
│   │       ├── migrations/            # Migracje bazy danych
│   │       ├── common/
│   │       │   └── entities/
│   │       │       └── base.entity.ts # Abstract: UUID PK, timestamps
│   │       ├── todos/                 # Moduł CRUD Todo
│   │       │   ├── todos.module.ts
│   │       │   ├── todos.controller.ts
│   │       │   ├── todos.service.ts
│   │       │   ├── entities/todo.entity.ts
│   │       │   └── dto/
│   │       │       ├── create-todo.dto.ts
│   │       │       └── update-todo.dto.ts
│   │       ├── boards/               # Moduł Kanban Board
│   │       │   ├── boards.module.ts
│   │       │   ├── boards.controller.ts
│   │       │   ├── boards.service.ts  # exports: BoardsService
│   │       │   ├── entities/board.entity.ts  # OneToMany → BoardColumn
│   │       │   └── dto/
│   │       │       ├── create-board.dto.ts
│   │       │       └── update-board.dto.ts
│   │       ├── columns/              # Moduł Kanban Column
│   │       │   ├── columns.module.ts  # imports: BoardsModule, exports: ColumnsService
│   │       │   ├── columns.controller.ts
│   │       │   ├── columns.service.ts # DI: BoardsService
│   │       │   ├── entities/board-column.entity.ts  # ManyToOne → Board, OneToMany → Task
│   │       │   └── dto/
│   │       │       ├── create-column.dto.ts
│   │       │       ├── update-column.dto.ts
│   │       │       └── reorder-columns.dto.ts
│   │       └── tasks/                # Moduł Kanban Task
│   │           ├── tasks.module.ts    # imports: ColumnsModule, exports: TasksService
│   │           ├── tasks.controller.ts
│   │           ├── tasks.service.ts   # DI: ColumnsService, transakcyjny move
│   │           ├── entities/task.entity.ts  # ManyToOne → BoardColumn (CASCADE)
│   │           └── dto/
│   │               ├── create-task.dto.ts
│   │               ├── update-task.dto.ts
│   │               └── move-task.dto.ts
│   └── web/                          # Next.js 15 frontend
│       └── src/
│           ├── app/                   # App Router
│           │   ├── layout.tsx, page.tsx, providers.tsx
│           │   ├── HomeContent.tsx    # Główny widok strony
│           │   └── todos/page.tsx     # Strona /todos
│           ├── components/
│           │   ├── layout/AppLayout.tsx
│           │   └── todos/            # TodoForm, TodoList, TodoItem
│           ├── store/                # Redux Toolkit
│           │   ├── store.ts
│           │   ├── hooks.ts          # useAppDispatch, useAppSelector
│           │   └── todosSlice.ts     # async thunks
│           ├── services/api.ts       # Axios client
│           ├── types/todo.ts
│           └── theme/theme.ts        # MUI iOS light theme
├── docker-compose.yml                # Production
├── docker-compose.dev.yml            # Dev z hot-reload
├── .github/workflows/ci.yml         # GitHub Actions
├── .env.example
├── CLAUDE.md                         # Ten plik
├── DZIENNIK_ZMIAN.md                 # Historia sesji
└── DOBRE_PRAKTYKI_CLAUDE_CODE.md     # Wzorce i best practices
```

---

## API Endpoints

| Method | Endpoint | Opis |
|--------|----------|------|
| GET | `/` | Health check |
| POST | `/todos` | Utwórz todo |
| GET | `/todos` | Lista todos (DESC) |
| GET | `/todos/:id` | Szczegóły todo |
| PATCH | `/todos/:id` | Aktualizuj todo |
| DELETE | `/todos/:id` | Usuń todo |
| POST | `/boards` | Utwórz board |
| GET | `/boards` | Lista boards (DESC) |
| GET | `/boards/:id` | Szczegóły board |
| PATCH | `/boards/:id` | Aktualizuj board |
| DELETE | `/boards/:id` | Usuń board |
| POST | `/columns` | Utwórz kolumnę (z boardId) |
| GET | `/boards/:boardId/columns` | Lista kolumn boarda (order ASC) |
| GET | `/columns/:id` | Szczegóły kolumny |
| PATCH | `/columns/:id` | Aktualizuj kolumnę |
| DELETE | `/columns/:id` | Usuń kolumnę |
| PATCH | `/boards/:boardId/columns/reorder` | Zmień kolejność kolumn |
| POST | `/tasks` | Utwórz task (z columnId) |
| GET | `/columns/:columnId/tasks` | Lista tasków kolumny (order ASC) |
| GET | `/tasks/:id` | Szczegóły taska |
| PATCH | `/tasks/:id` | Aktualizuj task |
| DELETE | `/tasks/:id` | Usuń task |
| PATCH | `/tasks/:id/move` | Przenieś task (transakcyjnie) |

Swagger docs: `http://localhost:3001/docs`

---

## Zmienne środowiskowe

```
API_PORT=3001
CORS_ORIGIN=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=spark
DB_PASSWORD=spark_secret
DB_NAME=spark_db
BACKEND_URL=http://localhost:3001
```

---

## Komendy

```bash
# Dev (lokalne)
npm run dev              # Oba serwisy równolegle
npm run dev:api          # Tylko API (NestJS watch)
npm run dev:web          # Tylko frontend (Next.js dev)

# Dev (Docker)
npm run docker:dev       # docker compose dev z hot-reload
npm run docker:down      # Zatrzymaj kontenery

# Produkcja (Docker)
npm run docker:prod      # docker compose produkcyjny

# Build
npm run build            # Oba workspace'y
npm run build:api
npm run build:web

# Testy
npm test                 # Wszystkie workspace'y
npm test -w apps/api     # Tylko backend
npm test -w apps/web     # Tylko frontend
npm test -w apps/api -- --testPathPattern=tasks  # Tylko testy danego modułu

# Lint
npm run lint --workspaces --if-present
npm run lint -w apps/api     # Tylko backend (ESLint 9 + typescript-eslint)
npm run lint -w apps/web     # Tylko frontend (Next.js ESLint)

# Typecheck
npm run typecheck -w apps/api   # tsc --noEmit (sprawdzanie typów bez kompilacji)

# NestJS CLI (generowanie)
npx nest generate resource nazwa --no-spec   # W apps/api/

# Migracje (w apps/api/)
npm run migration:generate -- src/migrations/NazwaMigracji   # Generuj z diff entity vs DB
npm run migration:run                                         # Uruchom pending migracje
npm run migration:revert                                      # Cofnij ostatnią migrację
npm run migration:show                                        # Pokaż status migracji
```

---

## Wzorce kodu

### Backend (NestJS)
- **Moduł** = Controller + Service + Entity + DTO
- **Walidacja** = class-validator w DTO + globalny ValidationPipe (whitelist, transform)
- **Entity** = TypeORM z UUID PK, CreateDateColumn, UpdateDateColumn
- **Migracje** = TypeORM migrations (synchronize: false, migrationsRun: true)
- **Wyjątki** = wbudowane NestJS (NotFoundException, BadRequestException)

### Frontend (Next.js)
- **State** = Redux Toolkit z createAsyncThunk
- **API** = Axios przez `/api` proxy (next.config.ts rewrites do BACKEND_URL)
- **UI** = MUI 6 + Tailwind CSS 4 + Emotion
- **Komponenty** = `'use client'` tylko gdy potrzebne (hooks, events, Redux)

---

## Czego unikać

### Architektura
- **NIE** umieszczaj logiki biznesowej w kontrolerach
- **NIE** importuj bezpośrednio między `apps/api` i `apps/web`
- **NIE** używaj `synchronize: true` - używaj migracji (`migration:generate`)

### Kod
- **NIE** używaj `any` - typuj prawidłowo
- **NIE** hardcoduj konfiguracji - użyj `process.env` / `ConfigModule`
- **NIE** twórz endpointów bez Swagger dekoratorów
- **NIE** pomijaj walidacji DTO

### Baza danych
- **NIE** usuwaj fizycznie rekordów na produkcji (soft delete)
- **NIE** twórz raw SQL gdy TypeORM QueryBuilder wystarczy

---

## Workflow rozwoju (Spec-Driven Development)

**Oficjalny spec-kit**: https://github.com/github/spec-kit

**Główna komenda:** `/start-task "opis funkcjonalności"` — prowadzi przez cały workflow automatycznie.

Komendy szczegółowe (jeśli chcesz uruchamiać ręcznie):
- `/speckit.constitution` — zasady projektu (`.specify/memory/constitution.md`)
- `/speckit.specify "opis"` — specyfikacja funkcjonalności
- `/speckit.clarify` — wyjaśnienie niejasności (opcjonalnie)
- `/speckit.plan` — plan techniczny
- `/speckit.tasks` — lista zadań
- `/speckit.implement` — implementacja
- `/speckit.checklist` — checklista jakości (opcjonalnie)
- `/speckit.analyze` — analiza spójności (opcjonalnie)
- `/speckit.taskstoissues` — eksport zadań do GitHub Issues (opcjonalnie)

Artefakty: `.specify/specs/{###-feature}/`
Konstytucja: `.specify/memory/constitution.md`

## Active Technologies
- TypeScript 5.7 / Node.js 22 (005-api-smoke-test)

## Recent Changes
- 005-api-smoke-test: Added TypeScript 5.7 / Node.js 22

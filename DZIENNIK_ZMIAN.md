# Dziennik Zmian - Spark Test Project

Historia prac nad projektem.

---

## 2026-03

### 2026-03-02 (Claude) - Sesja 5

**Temat: Board Entity & CRUD API (feature 002)**

1. **Reorganizacja planu specs/** — przenumerowanie featurów 002-010
   - Dodano `005-api-smoke-test` (bramka walidacyjna API)
   - Split `005-board-frontend-state` → `006-board-types-api` + `007-board-redux-state`
   - Przenumerowano 006→008, 007→009, 008→010

2. **BaseEntity** — abstrakcyjna klasa bazowa z UUID PK, timestamps
   - `apps/api/src/common/entities/base.entity.ts`
   - Reusable dla Board, BoardColumn, Task

3. **Board CRUD API** — pełny moduł NestJS
   - Entity: Board (name, description nullable)
   - DTOs: CreateBoardDto (name required), UpdateBoardDto (all optional)
   - Service: create, findAll (DESC), findOne (404), update, remove
   - Controller: 5 endpointów z Swagger dekoratorami + ParseUUIDPipe
   - Module: eksportuje BoardsService (SOLID DI)

4. **Migracja** — `CreateBoards` tworzy tabelę `boards`

5. **Testy** — 30/30 PASS
   - Unit: BoardsService (12 testów — CRUD + NotFoundException)
   - E2E: BoardsController (12 testów — HTTP status codes, validation, UUID pipe)

6. **Konstytucja** — dodano MVP exception dla fizycznego delete

**Pliki nowe:**
- `apps/api/src/common/entities/base.entity.ts`
- `apps/api/src/boards/boards.module.ts`
- `apps/api/src/boards/boards.controller.ts`
- `apps/api/src/boards/boards.service.ts`
- `apps/api/src/boards/entities/board.entity.ts`
- `apps/api/src/boards/dto/create-board.dto.ts`
- `apps/api/src/boards/dto/update-board.dto.ts`
- `apps/api/src/boards/boards.service.spec.ts`
- `apps/api/src/boards/boards.controller.spec.ts`
- `apps/api/src/migrations/1772475941993-CreateBoards.ts`
- `specs/005-api-smoke-test/spec.md`
- `specs/007-board-redux-state/spec.md`

**Pliki zmienione:**
- `apps/api/src/app.module.ts` (import BoardsModule)
- `apps/api/src/main.ts` (Swagger tag 'boards')
- `.specify/memory/constitution.md` (MVP delete exception)
- `specs/002-board-entity-api/{spec,plan,tasks}.md` (analysis fixes)
- `specs/006-board-types-api/spec.md` (split z old 005)
- `specs/008-board-list-page/spec.md` (renumber)
- `specs/009-kanban-board-view/spec.md` (renumber)
- `specs/010-drag-and-drop/spec.md` (renumber)

---

### 2026-03-02 (Claude) - Sesja 4

**Temat: TypeORM Migracje + NestJS Cheatsheet**

1. **TypeORM Migrations** - zastąpienie `synchronize: true` migracjami
   - `data-source.ts` - standalone DataSource dla TypeORM CLI
   - `InitialSchema` - pierwsza migracja (CREATE TABLE IF NOT EXISTS todos)
   - `app.module.ts` - `synchronize: false`, `migrationsRun: true`
   - Skrypty npm: `migration:generate`, `migration:run`, `migration:revert`, `migration:show`
   - Dodano `tsconfig-paths` do devDependencies

2. **NestJS vs Laravel Cheatsheet** - `docs/NESTJS_LARAVEL_CHEATSHEET.md`
   - Porównanie 1:1: Moduł/ServiceProvider, Entity/Model, DTO/FormRequest
   - Controller, Service, DI, przepływ requestu, migracje
   - Tabela podsumowująca wszystkie koncepty

3. **Aktualizacja dokumentacji**
   - `CLAUDE.md` - usunięto bloker synchronize, dodano migracje do struktury/komend/wzorców
   - `README.md` - dodano komendy migracji do Scripts, `docs/` do struktury

**Pliki nowe:**
- `apps/api/src/data-source.ts`
- `apps/api/src/migrations/1772472188750-InitialSchema.ts`
- `docs/NESTJS_LARAVEL_CHEATSHEET.md`

**Pliki zmienione:**
- `apps/api/src/app.module.ts` (synchronize: false, migrationsRun: true)
- `apps/api/package.json` (skrypty migracji, tsconfig-paths)
- `CLAUDE.md` (migracje, usunięty bloker)
- `README.md` (komendy migracji, docs/)
- `DZIENNIK_ZMIAN.md` (ten wpis)

---

### 2026-03-02 (Claude) - Sesja 3

**Temat: Instalacja Spec-Kit (Spec-Driven Development)**

1. **Spec-Kit CLI** - zainstalowano oficjalny github/spec-kit v0.1.6
   - Python 3.13 + uv (brew install)
   - `specify init --here --force --ai claude --script sh`

2. **Struktura `.specify/`** - wygenerowana przez specify init
   - `scripts/bash/` — 5 skryptów (common, create-new-feature, check-prerequisites, setup-plan, update-agent-context)
   - `templates/` — 6 szablonów (spec, plan, tasks, checklist, constitution, agent-file)
   - `memory/constitution.md` — konstytucja dostosowana do Spark (9 artykułów)

3. **Komendy Claude Code** (`.claude/commands/`)
   - 9 komend speckit z `specify init`: specify, clarify, plan, tasks, implement, checklist, analyze, constitution, taskstoissues
   - `/start-task` — nowa komenda orkiestrująca cały workflow (4 fazy)

4. **Dostosowania do Spark**
   - `constitution.md` — zasady NestJS/Next.js/TypeORM/TypeScript
   - `plan-template.md` — kontekst techniczny Spark (stack, struktura monorepo)
   - `CLAUDE.md` — sekcja "Workflow rozwoju (Spec-Driven Development)"
   - `README.md` — sekcja "Development Workflow" z instrukcją dodawania features

5. **Docker compatibility**
   - `.dockerignore` — dodano `.specify/`, `.claude/`, `specs/`
   - `.gitignore` — dodano `.claude/settings.local.json`

**Pliki nowe:**
- `.specify/` (cały katalog — specify init)
- `.claude/commands/speckit.*.md` (9 plików — specify init)
- `.claude/commands/start-task.md` (nowy — orkiestrator)
- `SPEC-KIT-SPARK.md` (przewodnik wdrożenia)
- `specs/` (katalog na artefakty features)

**Pliki zmienione:**
- `.dockerignore` (update — wykluczenia spec-kit)
- `.gitignore` (update — settings.local.json)
- `CLAUDE.md` (update — sekcja workflow)
- `README.md` (update — sekcja Development Workflow)
- `DZIENNIK_ZMIAN.md` (update — ten wpis)
- `.specify/memory/constitution.md` (update — Spark-specific)
- `.specify/templates/plan-template.md` (update — Spark tech stack)

---

### 2026-03-02 (Claude) - Sesja 2

**Temat: iOS-Style Light Theme z Glass Effects**

1. **Theme light iOS** - zmiana z ciemnego motywu na jasny inspirowany iOS 18
   - Paleta: `#F2F2F7` tło, iOS blue `#007AFF` primary, `#34C759` secondary
   - Glass morphism: semi-transparentne białe tła z backdrop-filter blur
   - Font: Inter zamiast DM Sans/Outfit
   - Component overrides: Paper, Card, AppBar, TextField, Button, Checkbox, IconButton, Tooltip
   - Pliki: `apps/web/src/theme/theme.ts`

2. **Globals CSS** - nowe tło, glass utilities, scrollbar dla light theme
   - Usunięto cosmic gradient i animacje drift
   - Subtelne pastelowe gradienty w tle
   - Pliki: `apps/web/src/app/globals.css`

3. **Komponenty** - dostosowanie inline colors do jasnego motywu
   - AppLayout: navbar z frosted glass, iOS blue active state
   - HomeContent: hero gradient, CTA card, tech stack cards
   - TodosPage: header gradient, error state colors
   - TodoItem: light bg, hover, delete button (iOS red #FF3B30)
   - TodoList: empty state colors

4. **Spec-kit artifacts** - pełny workflow SDD
   - Pliki: `specs/001-ios-light-theme/{spec,plan,tasks}.md`

**Testy:** API 7/7 PASS, Web 3/3 PASS

**Pliki zmienione:**
- `apps/web/src/theme/theme.ts` (update - light iOS theme)
- `apps/web/src/app/globals.css` (update - light bg, glass utilities)
- `apps/web/src/app/HomeContent.tsx` (update - light colors)
- `apps/web/src/app/todos/page.tsx` (update - light colors)
- `apps/web/src/components/layout/AppLayout.tsx` (update - light navbar)
- `apps/web/src/components/todos/TodoItem.tsx` (update - light colors)
- `apps/web/src/components/todos/TodoList.tsx` (update - light colors)
- `specs/001-ios-light-theme/spec.md` (nowy)
- `specs/001-ios-light-theme/plan.md` (nowy)
- `specs/001-ios-light-theme/tasks.md` (nowy)

---

### 2026-03-02 (Claude) - Sesja 1

**Temat: Konfiguracja Claude Code + dobre praktyki**

1. **DOBRE_PRAKTYKI_CLAUDE_CODE.md** - przygotowanie przewodnika dobrych praktyk
   - Zaadaptowano z szablonu Laravel/React na Next.js/NestJS/TypeORM
   - Sekcje: konfiguracja, dokumentacja API, skille, testowanie, wzorce kodu, CI/CD, anty-wzorce, szablony

2. **CLAUDE.md** - kontekst projektu dla Claude Code
   - Struktura monorepo, endpointy API, komendy, wzorce kodu, zmienne env

3. **DZIENNIK_ZMIAN.md** - historia sesji (ten plik)

4. **Skille Claude Code** - check-docs, commit
   - `.claude/skills/check-docs/SKILL.md`
   - `.claude/skills/commit/SKILL.md`

**Pliki zmienione:**
- `DOBRE_PRAKTYKI_CLAUDE_CODE.md` (update - przepisano na nowy stack)
- `CLAUDE.md` (nowy)
- `DZIENNIK_ZMIAN.md` (nowy)
- `.claude/skills/check-docs/SKILL.md` (nowy)
- `.claude/skills/commit/SKILL.md` (nowy)

---

## 2026-02

### 2026-02-XX - Sesja 0

**Temat: Inicjalizacja projektu**

1. **Monorepo setup** - npm workspaces z apps/web i apps/api
2. **Backend** - NestJS 11 z TypeORM, MariaDB, Swagger
3. **Frontend** - Next.js 15, React 19, Redux Toolkit, MUI 6, Tailwind CSS 4
4. **Docker** - multi-stage builds, docker-compose dev/prod
5. **CI/CD** - GitHub Actions z MariaDB service
6. **CRUD Todos** - pełna implementacja (API + UI)

**Pliki:** cały projekt (initial commit)

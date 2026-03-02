# Tasks: BoardColumn Entity & CRUD API

**Input**: Design documents from `/specs/003-column-entity-api/`
**Prerequisites**: plan.md (✅), spec.md (✅), data-model.md (✅)

## Phase 1: Entity & Module Setup

**Purpose**: BoardColumn entity, DTO, moduł NestJS — fundament dla wszystkich user stories

- [x] T001 Create BoardColumn entity in `apps/api/src/columns/entities/board-column.entity.ts` — extends BaseEntity, fields: name (string), order (int, default 0), ManyToOne → Board with onDelete CASCADE
- [x] T002 Update Board entity in `apps/api/src/boards/entities/board.entity.ts` — add @OneToMany → BoardColumn[]
- [x] T003 [P] Create CreateColumnDto in `apps/api/src/columns/dto/create-column.dto.ts` — name (IsString, IsNotEmpty, MaxLength(255)), boardId (IsUUID)
- [x] T004 [P] Create UpdateColumnDto in `apps/api/src/columns/dto/update-column.dto.ts` — name (IsString, IsOptional, MaxLength(255))
- [x] T005 [P] Create ReorderColumnsDto in `apps/api/src/columns/dto/reorder-columns.dto.ts` — columnIds (IsArray, ArrayNotEmpty, IsUUID each)
- [x] T006 Create ColumnsModule in `apps/api/src/columns/columns.module.ts` — imports: TypeOrmModule.forFeature([BoardColumn]), BoardsModule; exports: ColumnsService
- [x] T007 Register ColumnsModule in `apps/api/src/app.module.ts`
- [x] T008 Generate TypeORM migration for board_columns table — run `npm run migration:generate` in apps/api

**Checkpoint**: Entity, DTOs, moduł zarejestrowany — gotowe do implementacji serwisu

---

## Phase 2: User Story 1 — Create a column in a board (P1)

**Goal**: POST /columns tworzy kolumnę z auto-assigned order, waliduje istnienie boarda

- [x] T009 Implement ColumnsService.create() in `apps/api/src/columns/columns.service.ts` — inject BoardsService, validate board exists, auto-assign order = max(order in board) + 1
- [x] T010 Implement POST /columns in ColumnsController in `apps/api/src/columns/columns.controller.ts` — Swagger decorators, ParseUUIDPipe where needed

**Checkpoint**: POST /columns działa z auto-order i walidacją boarda

---

## Phase 3: User Story 2 — List columns for a board (P1)

**Goal**: GET /boards/:boardId/columns zwraca kolumny posortowane po order ASC

- [x] T011 Implement ColumnsService.findAllByBoard(boardId) in `apps/api/src/columns/columns.service.ts` — validate board exists, return columns sorted by order ASC
- [x] T012 Implement GET /boards/:boardId/columns in ColumnsController — Swagger decorators
- [x] T013 Update BoardsService.findOne() in `apps/api/src/boards/boards.service.ts` — eager load columns with order ASC

**Checkpoint**: Lista kolumn i board detail z kolumnami działają

---

## Phase 4: User Story 3 — Reorder columns (P2)

**Goal**: PATCH /boards/:boardId/columns/reorder zmienia kolejność kolumn

- [x] T014 Implement ColumnsService.reorder(boardId, columnIds) in `apps/api/src/columns/columns.service.ts` — validate board exists, validate no duplicate IDs, validate all columnIds belong to board and none missing, bulk-update order in transaction
- [x] T015 Implement PATCH /boards/:boardId/columns/reorder in ColumnsController — Swagger decorators

**Checkpoint**: Reorder kolumn działa

---

## Phase 5: User Stories 4 & 5 — Update & Delete column (P2)

**Goal**: PATCH /columns/:id i DELETE /columns/:id

- [x] T016 [P] Implement ColumnsService.findOne(id) in `apps/api/src/columns/columns.service.ts`
- [x] T017 [P] Implement ColumnsService.update(id, dto) in `apps/api/src/columns/columns.service.ts`
- [x] T018 [P] Implement ColumnsService.remove(id) in `apps/api/src/columns/columns.service.ts`
- [x] T019 Implement GET /columns/:id, PATCH /columns/:id, DELETE /columns/:id in ColumnsController — Swagger decorators

**Checkpoint**: Pełny CRUD na kolumnach działa

---

## Phase 6: Tests

**Purpose**: Unit testy serwisu + E2E testy kontrolera (wzorzec z boards)

- [x] T020 Write ColumnsService unit tests in `apps/api/src/columns/columns.service.spec.ts` — mock repository + BoardsService, test: create (auto-order, board not found, first column order=0), findAllByBoard, findOne, update, remove, reorder (happy path, duplicate IDs, foreign IDs, missing columns)
- [x] T021 Write ColumnsController E2E tests in `apps/api/src/columns/columns.controller.spec.ts` — Supertest, test all endpoints: POST (201, 400, 404), GET list (200, sorted), GET single (200, 404), PATCH (200, 404), DELETE (200, 404), reorder (200, 400 invalid IDs, 400 empty array, 404 board not found); validation errors (400 missing name, 400 invalid UUID, 400 name too long)

**Checkpoint**: `npm test -w apps/api` przechodzi

---

## Phase 7: Polish

- [x] T022 Run `npm test -w apps/api` and fix any failures
- [x] T023 Run `npm run lint --workspaces --if-present` and fix any issues

---

## Dependencies & Execution Order

- **Phase 1** (T001-T008): No dependencies — start immediately
- **Phase 2** (T009-T010): Depends on Phase 1 (entity + module)
- **Phase 3** (T011-T013): Depends on Phase 1
- **Phase 4** (T014-T015): Depends on Phase 1
- **Phase 5** (T016-T019): Depends on Phase 1
- **Phase 6** (T020-T021): Depends on Phases 2-5 (all service methods)
- **Phase 7** (T022-T023): Depends on Phase 6

Phases 2-5 can run sequentially (single developer) as they build on the same service file.

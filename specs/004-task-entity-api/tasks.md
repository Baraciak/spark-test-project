# Tasks: Task Entity & CRUD API + Move Endpoint

**Input**: Design documents from `/specs/004-task-entity-api/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Setup (Entity + Module)

**Purpose**: Task entity, moduł NestJS, migracja DB

- [x] T001 Create Task entity in `apps/api/src/tasks/entities/task.entity.ts` — extends BaseEntity, fields: title (varchar 255), description (text nullable), order (int default 0), columnId (UUID FK), ManyToOne → BoardColumn (CASCADE)
- [x] T002 Update BoardColumn entity in `apps/api/src/columns/entities/board-column.entity.ts` — dodać @OneToMany(() => Task, (task) => task.column) relation
- [x] T003 Create DTOs: `apps/api/src/tasks/dto/create-task.dto.ts` (title required, description optional, columnId UUID), `update-task.dto.ts` (title optional, description optional), `move-task.dto.ts` (columnId UUID required, order int >= 0 required) — class-validator + Swagger decorators
- [x] T004 Create TasksModule in `apps/api/src/tasks/tasks.module.ts` — imports: ColumnsModule, TypeOrmModule.forFeature([Task]), exports: TasksService
- [x] T005 Register TasksModule in `apps/api/src/app.module.ts`
- [x] T006 Generate TypeORM migration for `tasks` table: `npm run migration:generate -- src/migrations/CreateTaskTable` (in apps/api/)

**Checkpoint**: Task entity istnieje, migracja tworzy tabelę, moduł zarejestrowany

---

## Phase 2: US1 — Create a task in a column (P1)

**Goal**: POST /tasks z auto-assigned order

- [x] T007 [US1] Implement `TasksService.create(dto)` + `findOne(id)` in `apps/api/src/tasks/tasks.service.ts` — findOne z NotFoundException (used by move, update, remove), create: walidacja columnId przez ColumnsService.findOne(), auto-assign order = MAX(order w kolumnie) + 1, return saved task
- [x] T008 [US1] Implement `TasksController.create()` in `apps/api/src/tasks/tasks.controller.ts` — POST /tasks, @ApiTags('tasks'), Swagger decorators, delegate to service

**Checkpoint**: POST /tasks → 201 z auto-assigned order, 404 jeśli column nie istnieje

---

## Phase 3: US2 — List tasks for a column (P1)

**Goal**: GET /columns/:columnId/tasks sorted by order ASC

- [x] T009 [US2] Implement `TasksService.findAllByColumn(columnId)` — walidacja columnId, return tasks sorted by order ASC
- [x] T010 [US2] Implement `TasksController.findAllByColumn()` — GET /columns/:columnId/tasks, Swagger decorators

**Checkpoint**: GET /columns/:columnId/tasks → 200 z taskami sorted by order

---

## Phase 4: US3 — Move task between columns (P1)

**Goal**: PATCH /tasks/:id/move — transakcyjny move z queryRunner

- [x] T011 [US3] Implement `TasksService.move(id, moveDto)` in `apps/api/src/tasks/tasks.service.ts` — transakcja queryRunner: (1) walidacja task i target column, (2) jeśli inna kolumna: close gap w source, shift orders w target, update task; jeśli ta sama kolumna: reorder w ramach jednej kolumny, (3) commit/rollback
- [x] T012 [US3] Implement `TasksController.move()` — PATCH /tasks/:id/move, Swagger decorators

**Checkpoint**: Move task między kolumnami transakcyjnie, reorder w tej samej kolumnie

---

## Phase 5: US4 + US5 — Update & Delete task (P2)

**Goal**: PATCH /tasks/:id i DELETE /tasks/:id

- [x] T013 [P] [US4] Implement `TasksService.findOne(id)` + `update(id, dto)` — findOne z NotFoundException, update title/description
- [x] T014 [P] [US5] Implement `TasksService.remove(id)` — findOne + remove
- [x] T015 [US4] Implement `TasksController.findOne()` + `update()` — GET /tasks/:id, PATCH /tasks/:id, Swagger
- [x] T016 [US5] Implement `TasksController.remove()` — DELETE /tasks/:id, Swagger

**Checkpoint**: CRUD kompletny — create, list, get, update, delete, move

---

## Phase 6: Eager Loading + Integration

**Goal**: Board.findOne() zwraca pełne drzewo board → columns → tasks

- [x] T017 Update `BoardsService.findOne()` in `apps/api/src/boards/boards.service.ts` — eager load tasks w columns: relations: ['columns', 'columns.tasks'], order: columns.order ASC + columns.tasks.order ASC

**Checkpoint**: GET /boards/:id zwraca board → columns (order ASC) → tasks (order ASC)

---

## Phase 7: Tests

**Purpose**: Unit testy serwisu + E2E kontrolera

- [x] T018 [P] Unit tests for TasksService in `apps/api/src/tasks/tasks.service.spec.ts` — mock repository, ColumnsService, DataSource; test create (auto-order), findAllByColumn, findOne, update, remove, move (same column, cross column, rollback)
- [x] T019 [P] E2E tests for TasksController in `apps/api/src/tasks/tasks.controller.spec.ts` — test all 6 endpoints: POST /tasks, GET /columns/:columnId/tasks, GET /tasks/:id, PATCH /tasks/:id, DELETE /tasks/:id, PATCH /tasks/:id/move

**Checkpoint**: `npm test -w apps/api` PASS

---

## Phase 8: Polish

- [x] T020 Verify migration runs correctly: `npm run docker:dev` → check tasks table exists
- [x] T021 Verify Swagger docs at http://localhost:3001/docs — tag "tasks" z 6 endpointami

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (US1)**: Depends on T001, T003, T004, T005 (entity, DTOs, module)
- **Phase 3 (US2)**: Depends on T007 (service create method defines service structure)
- **Phase 4 (US3)**: Depends on T007 (needs service base)
- **Phase 5 (US4+5)**: Depends on T007 (needs service base)
- **Phase 6 (Eager)**: Depends on T001, T002 (entity relations)
- **Phase 7 (Tests)**: Depends on all implementation phases
- **Phase 8 (Polish)**: Depends on T006 (migration) and all implementation

### Parallel Opportunities

- T001 + T002: entity + relation update — parallel (different files)
- T013 + T014: update + delete service — parallel (different methods)
- T018 + T019: unit + E2E tests — parallel (different files)

### Summary

- **21 tasks** in **8 phases**
- **5 user stories**: US1 (create), US2 (list), US3 (move), US4 (update), US5 (delete)

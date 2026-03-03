# Tasks: API Smoke Tests

**Branch**: `005-api-smoke-test` | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup

- [x] T001 [P1] Verify test infrastructure — run existing tests (`npm test -w apps/api`) to confirm baseline passes

## Phase 2: Health Check E2E (US1)

- [x] T002 [P1] [US1] Create `apps/api/test/app.e2e-spec.ts` — health check GET `/` → 200 + `{ status, timestamp }`

## Phase 3: Todos E2E Update (US2)

- [x] T003 [P1] [US2] Update `apps/api/test/todos.e2e-spec.ts` — add missing tests: invalid UUID → 400, non-existent UUID → 404, whitelist extra fields

## Phase 4: Boards E2E (US3)

- [x] T004 [P1] [US3] Create `apps/api/test/boards.e2e-spec.ts` — CRUD happy paths (POST 201, GET all 200, GET by id 200, PATCH 200, DELETE 200)
- [x] T005 [P1] [US3] Add validation tests to boards E2E — empty body → 400, invalid UUID → 400, non-existent → 404, PATCH with empty body `{}` → 200 (no changes)

## Phase 5: Columns E2E (US4)

- [x] T006 [P1] [US4] Create `apps/api/test/columns.e2e-spec.ts` — CRUD happy paths + reorder (POST 201, GET by board 200, GET by id 200, PATCH 200, DELETE 200, reorder 200)
- [x] T007 [P1] [US4] Add validation tests to columns E2E — missing boardId → 400, invalid UUID → 400, non-existent board → 404, duplicate reorder IDs → 400, incomplete reorder list → 400, columnId from another board → 400

## Phase 6: Tasks E2E (US5)

- [x] T008 [P1] [US5] Create `apps/api/test/tasks.e2e-spec.ts` — CRUD happy paths + move (POST 201, GET by column 200, GET by id 200, PATCH 200, DELETE 200, move 200)
- [x] T009 [P1] [US5] Add validation tests to tasks E2E — missing columnId → 400, invalid UUID → 400, non-existent column → 404, invalid move order → 400

## Phase 7: Verification

- [x] T010 [P1] Run full test suite `npm test -w apps/api` — all tests (unit + E2E) must pass with 0 failures

> **Note**: Lint (`npm run lint -w apps/api`) i typecheck (`npm run typecheck -w apps/api`) są uruchamiane w Fazie 4 (Finalizacja) workflow `/start-task`, nie w ramach tych zadań.

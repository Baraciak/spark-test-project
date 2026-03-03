# Tasks: 006-board-types-api

**Branch**: `006-board-types-api` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Types (US-1)

- [x] T001 [P1] [US-1] Utworzyć `apps/web/src/types/board.ts` z interfejsami Board, BoardColumn, Task
- [x] T002 [P1] [US-1] Dodać DTO interfaces: CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto, CreateTaskDto, UpdateTaskDto, MoveTaskDto, ReorderColumnsDto

## Phase 2: API Service (US-2)

- [x] T003 [P1] [US-2] Dodać boardsApi do `apps/web/src/services/api.ts` (getAll, getOne, create, update, remove)
- [x] T004 [P1] [US-2] Dodać columnsApi do `apps/web/src/services/api.ts` (getByBoard, getOne, create, update, remove, reorder)
- [x] T005 [P1] [US-2] Dodać tasksApi do `apps/web/src/services/api.ts` (getByColumn, getOne, create, update, remove, move)

## Phase 3: Verification

- [x] T006 Sprawdzić kompilację: `npm run build:web`
- [x] T007 Sprawdzić że todosApi działa bez regresji (istniejące testy)
- [x] T008 Uruchomić lint: `npm run lint -w apps/web` (pre-existing: next lint deprecated, build check passes)

# Tasks: Board Redux State Management

**Branch**: `007-board-redux-state` | **Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Phase 1: Core Slice

- [x] T001 [P1] [US1,US4] Create `boardsSlice.ts` with BoardsState interface, initial state, and board CRUD thunks (`fetchBoards`, `fetchBoard`, `addBoard`, `updateBoard`, `removeBoard`) — `apps/web/src/store/boardsSlice.ts`
- [x] T002 [P1] [US4] Register boards reducer in store — `apps/web/src/store/store.ts`

## Phase 2: Column Thunks

- [x] T003 [P1] [US2] Add column thunks to boardsSlice (`addColumn`, `updateColumn`, `removeColumn`, `reorderColumns`) with re-fetch pattern — `apps/web/src/store/boardsSlice.ts`

## Phase 3: Task Thunks

- [x] T004 [P1] [US3] Add task thunks to boardsSlice (`addTask`, `updateTask`, `removeTask`, `moveTask`) with re-fetch pattern — `apps/web/src/store/boardsSlice.ts`

## Phase 4: Verification

- [x] T005 [P1] Verify TypeScript compilation pass — `tsc --noEmit` (ESLint not configured for web — preexisting)

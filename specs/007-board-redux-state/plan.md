# Implementation Plan: Board Redux State Management

**Branch**: `007-board-redux-state` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)

## Summary

Add Redux Toolkit state management for Boards, Columns, and Tasks. Create a single `boardsSlice.ts` following the existing `todosSlice.ts` pattern, with async thunks for all CRUD operations plus column reorder and task move. Column/task mutations re-fetch the active board to ensure server-side ordering consistency. Register the new slice in `store.ts`.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: Redux Toolkit 2.5, React-Redux 9.2, Axios 1.7
**Existing Infrastructure**: `boardsApi`, `columnsApi`, `tasksApi` in `services/api.ts`; types in `types/board.ts`
**Pattern Reference**: `store/todosSlice.ts` — createAsyncThunk + createSlice + extraReducers builder

## Constitution Check

| Article | Gate | Status |
|---------|------|--------|
| III. Frontend | Redux Toolkit z createAsyncThunk | OK — following exactly |
| III. Frontend | API calls przez services/api.ts | OK — using existing boardsApi/columnsApi/tasksApi |
| IV. TypeScript | NIE używaj `any` | OK — all types from types/board.ts |
| V. Testowanie | Testy wymagane | OK — slice is pure Redux, testable in isolation |

No violations. No complexity justification needed.

## Source Code Changes

```text
apps/web/src/store/
├── boardsSlice.ts    # NEW — boards/columns/tasks state + thunks
└── store.ts          # EDIT — add boards reducer
```

## Design Decisions

### D1: Single slice vs three slices

**Decision**: Single `boardsSlice` for boards, columns, and tasks.

**Rationale**: Columns and tasks are always accessed in the context of a board (via `activeBoard`). Separate slices would create cross-slice coordination complexity. A single slice keeps the state tree simple and mutations atomic.

### D2: Re-fetch pattern for column/task mutations

**Decision**: After column/task CRUD operations, re-fetch the full active board via `boardsApi.getOne(boardId)`.

**Rationale**: The server manages ordering (auto-increment, reorder, move shifts). Re-fetching ensures the client always has correct order values.

### D3: Active board tracking

**Decision**: Store `activeBoard: Board | null` separately from `items: Board[]`.

**Rationale**: `items` is the board list (lightweight, no columns/tasks). `activeBoard` is the fully loaded board with eager columns and tasks. This mirrors the API: `GET /boards` returns list, `GET /boards/:id` returns full board.

## State Shape

```typescript
interface BoardsState {
  items: Board[];              // Board list (no columns/tasks)
  activeBoard: Board | null;   // Full board with columns → tasks
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
```

## Thunks

| Thunk | API Call | State Update |
|-------|----------|--------------|
| `fetchBoards` | `boardsApi.getAll()` | `items = payload` |
| `fetchBoard(id)` | `boardsApi.getOne(id)` | `activeBoard = payload` |
| `addBoard(dto)` | `boardsApi.create(dto)` | `items.unshift(payload)` |
| `updateBoard({id, data})` | `boardsApi.update(id, data)` | update in `items` |
| `removeBoard(id)` | `boardsApi.remove(id)` | filter from `items`, clear `activeBoard` if match |
| `addColumn(dto)` | `columnsApi.create(dto)` + re-fetch board | `activeBoard = re-fetched` |
| `updateColumn({id, data, boardId})` | `columnsApi.update(id, data)` + re-fetch board | `activeBoard = re-fetched` |
| `removeColumn({id, boardId})` | `columnsApi.remove(id)` + re-fetch board | `activeBoard = re-fetched` |
| `reorderColumns({boardId, columnIds})` | `columnsApi.reorder(boardId, dto)` + re-fetch board | `activeBoard = re-fetched` |
| `addTask(dto)` | `tasksApi.create(dto)` + re-fetch board | `activeBoard = re-fetched` |
| `updateTask({id, data, boardId})` | `tasksApi.update(id, data)` + re-fetch board | `activeBoard = re-fetched` |
| `removeTask({id, boardId})` | `tasksApi.remove(id)` + re-fetch board | `activeBoard = re-fetched` |
| `moveTask({id, data, boardId})` | `tasksApi.move(id, data)` + re-fetch board | `activeBoard = re-fetched` |

## Risks

| Risk | Mitigation |
|------|-----------|
| Re-fetching board after every mutation adds latency | Acceptable for MVP; optimize with optimistic updates later if needed |
| Column/task thunks need `boardId` param | Pass explicitly from component (available via `activeBoard.id`) |

# Feature Specification: Board Redux State Management

**Feature Branch**: `007-board-redux-state`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Add Redux Toolkit state management (slices, async thunks) for Boards, Columns, and Tasks"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Boards CRUD State (Priority: P1)

As a developer, I need a Redux slice for Boards so that the frontend can fetch, create, update, and delete boards with proper loading/error states.

**Why this priority**: Boards are the top-level entity. Without board state management, columns and tasks cannot be displayed.

**Independent Test**: Dispatch `fetchBoards()` thunk and verify the store contains board data with correct status transitions (idle → loading → succeeded).

**Acceptance Scenarios**:

1. **Given** store is initialized, **When** `fetchBoards()` is dispatched, **Then** `boards.status` transitions to `'loading'` then `'succeeded'`, and `boards.items` contains the API response.
2. **Given** boards are loaded, **When** `addBoard({ name, description })` is dispatched, **Then** the new board is prepended to `boards.items`.
3. **Given** a board exists, **When** `updateBoard({ id, data })` is dispatched, **Then** the board in `boards.items` is updated in place.
4. **Given** a board exists, **When** `removeBoard(id)` is dispatched, **Then** the board is removed from `boards.items`.
5. **Given** API returns error, **When** any thunk is rejected, **Then** `boards.status` is `'failed'` and `boards.error` contains the error message.

---

### User Story 2 - Active Board with Columns (Priority: P1)

As a developer, I need to load a single board with its columns and tasks (active board) and manage column CRUD + reorder so that a Kanban view can be rendered.

**Why this priority**: Columns are essential for the Kanban layout and must be loaded when viewing a board.

**Independent Test**: Dispatch `fetchBoard(id)` to load a board with eager-loaded columns, verify `activeBoard` is populated with columns sorted by order.

**Acceptance Scenarios**:

1. **Given** a board ID, **When** `fetchBoard(id)` is dispatched, **Then** `boards.activeBoard` is populated with the full board including columns and tasks.
2. **Given** an active board, **When** `addColumn({ name, boardId })` is dispatched, **Then** `activeBoard` is re-fetched and the new column appears.
3. **Given** columns exist, **When** `updateColumn({ id, data })` is dispatched, **Then** `activeBoard` is re-fetched with the updated column.
4. **Given** columns exist, **When** `removeColumn({ id, boardId })` is dispatched, **Then** `activeBoard` is re-fetched without the deleted column.
5. **Given** columns exist, **When** `reorderColumns({ boardId, columnIds })` is dispatched, **Then** `activeBoard` is re-fetched with new column order.

---

### User Story 3 - Tasks State Management (Priority: P1)

As a developer, I need task CRUD and move thunks so that tasks can be created, edited, deleted, and moved between columns.

**Why this priority**: Tasks are the core unit of work on a Kanban board. Moving tasks is the primary user interaction.

**Independent Test**: Dispatch `addTask({ title, columnId })` and verify the task appears in activeBoard, then dispatch `moveTask()` and verify the board re-fetches with updated state.

**Acceptance Scenarios**:

1. **Given** an active board with columns, **When** `addTask({ title, columnId })` is dispatched, **Then** `activeBoard` is re-fetched and the task appears in the target column.
2. **Given** a task exists, **When** `updateTask({ id, data })` is dispatched, **Then** `activeBoard` is re-fetched with the updated task.
3. **Given** a task exists, **When** `removeTask({ id, boardId })` is dispatched, **Then** `activeBoard` is re-fetched without the deleted task.
4. **Given** a task in column A, **When** `moveTask({ id, columnId: B, order: 0 })` is dispatched, **Then** `activeBoard` is re-fetched reflecting the new positions.

---

### User Story 4 - Store Registration (Priority: P1)

As a developer, I need the boards slice registered in the Redux store so that `useAppSelector(state => state.boards)` works.

**Why this priority**: Without store registration, no slice is usable.

**Independent Test**: Call `store.getState()` and verify `state.boards` exists with initial state shape.

**Acceptance Scenarios**:

1. **Given** the store is configured, **When** `store.getState()` is called, **Then** `state.boards` exists with `{ items: [], activeBoard: null, status: 'idle', error: null }`.

---

### Edge Cases

- Non-existent board ID in `fetchBoard()` → status `'failed'`, error from API 404.
- `addColumn` when board no longer exists → thunk rejected, error displayed.
- `moveTask` to a deleted column → thunk rejected, activeBoard should be re-fetched.
- Rapid consecutive dispatches → each thunk runs independently; re-fetch pattern ensures server-side consistency.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `boardsSlice` with async thunks: `fetchBoards`, `fetchBoard`, `addBoard`, `updateBoard`, `removeBoard`.
- **FR-002**: System MUST track `activeBoard` (Board | null) containing the full board with eager-loaded columns and tasks.
- **FR-003**: System MUST provide column thunks: `addColumn`, `updateColumn`, `removeColumn`, `reorderColumns` — each re-fetching `activeBoard` after mutation.
- **FR-004**: System MUST provide task thunks: `addTask`, `updateTask`, `removeTask`, `moveTask` — each re-fetching `activeBoard` after mutation.
- **FR-005**: Each thunk MUST handle loading states (`idle`, `loading`, `succeeded`, `failed`) and error messages.
- **FR-006**: Column/task mutation thunks MUST re-fetch the active board (via `boardsApi.getOne`) to ensure consistent ordering from the server.
- **FR-007**: The boards slice MUST be registered in the Redux store alongside the existing todos slice.
- **FR-008**: System MUST use existing API services (`boardsApi`, `columnsApi`, `tasksApi`) from `services/api.ts`.
- **FR-009**: System MUST use existing TypeScript types from `types/board.ts` — no `any` types.

### Key Entities

- **BoardsState**: `{ items: Board[], activeBoard: Board | null, status: 'idle' | 'loading' | 'succeeded' | 'failed', error: string | null }`
- **Board**: Top-level entity — name, description, columns[] (from `types/board.ts`)
- **BoardColumn**: Column — name, order, boardId, tasks[] (from `types/board.ts`)
- **Task**: Task — title, description, order, columnId (from `types/board.ts`)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 board thunks implemented and dispatching correctly.
- **SC-002**: All 4 column thunks implemented, each re-fetching activeBoard.
- **SC-003**: All 4 task thunks implemented, each re-fetching activeBoard.
- **SC-004**: `boardsSlice` registered in store, `state.boards` accessible via hooks.
- **SC-005**: TypeScript compiles without errors (`tsc --noEmit`).
- **SC-006**: ESLint passes with zero errors.
- **SC-007**: No `any` types — all state, payloads, and returns properly typed.

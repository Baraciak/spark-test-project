# Feature Specification: Board Redux State Management

**Feature Branch**: `007-board-redux-state`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz boardSlice z Redux Toolkit — async thunks dla CRUD boards/columns/tasks, optimistic moveTaskOptimistic reducer, rejestracja w store — wzorcem todosSlice"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Board list state management (Priority: P1)

Jako frontend developer chcę async thunks do zarządzania listą tablic (fetch, create, delete), aby strona /boards mogła wyświetlać i zarządzać tablicami.

**Why this priority**: Lista tablic to punkt wejścia — pierwszy ekran po nawigacji do /boards.

**Independent Test**: Dispatch fetchBoards → state.board.boards wypełniony danymi z API.

**Acceptance Scenarios**:

1. **Given** boardSlice zarejestrowany w store, **When** dispatch(fetchBoards()), **Then** state.board.boards zawiera listę z API
2. **Given** boardSlice, **When** dispatch(createBoard({ name: "Sprint 1" })), **Then** nowy board dodany do state.board.boards
3. **Given** boardSlice, **When** dispatch(deleteBoard(id)), **Then** board usunięty z state.board.boards
4. **Given** fetchBoards pending, **When** loading, **Then** state.board.status === 'loading'
5. **Given** fetchBoards rejected, **When** API error, **Then** state.board.status === 'failed', error message w state

---

### User Story 2 - Active board with full tree (Priority: P1)

Jako frontend developer chcę async thunk fetchBoard(id) ładujący pełne drzewo board → columns → tasks, aby widok Kanban miał kompletne dane.

**Why this priority**: Pełne drzewo to dane dla widoku Kanban — bez niego nie ma tablicy.

**Independent Test**: Dispatch fetchBoard(id) → state.board.activeBoard zawiera board z columns i tasks.

**Acceptance Scenarios**:

1. **Given** boardSlice, **When** dispatch(fetchBoard(id)), **Then** state.board.activeBoard zawiera board z columns (order ASC) i tasks (order ASC)
2. **Given** fetchBoard z nieistniejącym ID, **When** API 404, **Then** state.board.error ustawiony
3. **Given** activeBoard załadowany, **When** dispatch(createColumn({ name: "New", boardId })), **Then** kolumna dodana do activeBoard.columns
4. **Given** activeBoard załadowany, **When** dispatch(deleteColumn(id)), **Then** kolumna usunięta z activeBoard.columns

---

### User Story 3 - Task CRUD in active board (Priority: P1)

Jako frontend developer chcę async thunks do zarządzania taskami w aktywnej tablicy.

**Why this priority**: Taski to core content — dodawanie, edycja, usuwanie z poziomu widoku Kanban.

**Independent Test**: Dispatch createTask → task dodany do odpowiedniej kolumny w activeBoard.

**Acceptance Scenarios**:

1. **Given** activeBoard z kolumnami, **When** dispatch(createTask({ title: "Task", columnId })), **Then** task dodany do odpowiedniej kolumny w activeBoard
2. **Given** activeBoard z taskami, **When** dispatch(updateTask({ id, title: "New" })), **Then** task zaktualizowany w odpowiedniej kolumnie
3. **Given** activeBoard z taskami, **When** dispatch(deleteTask(id)), **Then** task usunięty z odpowiedniej kolumny

---

### User Story 4 - Optimistic move task (Priority: P1)

Jako frontend developer chcę synchroniczny reducer moveTaskOptimistic i async thunk moveTask z revert on failure, aby drag & drop (feature 010) działał płynnie.

**Why this priority**: Optimistic update to klucz do responsive UX — użytkownik widzi zmianę natychmiast.

**Independent Test**: Dispatch moveTaskOptimistic → state zmieniony natychmiast. MoveTask rejected → revert.

**Acceptance Scenarios**:

1. **Given** activeBoard z taskami, **When** dispatch(moveTaskOptimistic({ taskId, sourceColumnId, targetColumnId, newOrder })), **Then** task przeniesiony w state natychmiast (synchronicznie)
2. **Given** moveTask dispatched, **When** API potwierdza, **Then** state pozostaje (no-op — already updated)
3. **Given** moveTask dispatched, **When** API rejected, **Then** state reverted do snapshot sprzed move
4. **Given** revert, **When** state przywrócony, **Then** task wraca do oryginalnej kolumny i pozycji

---

### Edge Cases

- Co się dzieje gdy API jest niedostępne? → status: 'failed', error message w state
- Co się dzieje gdy moveTask optimistic update a potem API failure? → Revert state do snapshot sprzed move
- Co się dzieje gdy fetchBoard z nieistniejącym ID? → 404 → error w state
- Co się dzieje przy concurrent dispatch? → Redux serializes reducers — safe

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: boardSlice state: `{ boards: Board[], activeBoard: Board | null, status: 'idle' | 'loading' | 'succeeded' | 'failed', error: string | null }`
- **FR-002**: Async thunks (boards): fetchBoards, fetchBoard, createBoard, deleteBoard
- **FR-003**: Async thunks (columns): createColumn, deleteColumn, reorderColumns
- **FR-004**: Async thunks (tasks): createTask, updateTask, deleteTask, moveTask
- **FR-005**: Synchroniczny reducer moveTaskOptimistic — immediate state update for drag & drop
- **FR-006**: moveTask.rejected MUSI revert state do snapshot zapisanego w moveTask.pending
- **FR-007**: store.ts MUSI zarejestrować boardReducer obok istniejącego todosReducer
- **FR-008**: Wzorzec thunków spójny z istniejącym todosSlice (createAsyncThunk)
- **FR-009**: Użycie typów i API service z feature 006 (boardsApi, columnsApi, tasksApi)

### Key Entities

- **BoardState** (interface): Stan slice — boards list, active board, status, error

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: boardSlice zarejestrowany w store — `useAppSelector(state => state.board)` działa
- **SC-002**: Dispatch fetchBoards/fetchBoard aktualizuje state (loading → succeeded/failed)
- **SC-003**: Dispatch createBoard/deleteBoard aktualizuje state.boards
- **SC-004**: Dispatch createColumn/deleteColumn aktualizuje state.activeBoard.columns
- **SC-005**: Dispatch createTask/updateTask/deleteTask aktualizuje taski w odpowiedniej kolumnie
- **SC-006**: moveTaskOptimistic synchronicznie przenosi task w state
- **SC-007**: moveTask.rejected revertuje state do snapshot
- **SC-008**: TypeScript kompiluje bez błędów (`npm run build:web`)
- **SC-009**: Istniejący todosSlice działa bez regresji

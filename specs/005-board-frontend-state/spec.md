# Feature Specification: Frontend Types + Redux Slice + API Service

**Feature Branch**: `005-board-frontend-state`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz typy TypeScript (Board, BoardColumn, Task), Redux Toolkit slice z async thunks, i rozszerzenie Axios API service — wzorcem todosSlice i api.ts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - TypeScript types for Kanban model (Priority: P1)

Jako frontend developer chcę mieć interfejsy TypeScript (Board, BoardColumn, Task) odzwierciedlające model danych z API, aby zapewnić type safety w całej aplikacji.

**Why this priority**: Typy to fundament — bez nich nie ma type-safe Redux slice ani API service.

**Independent Test**: Importowanie typów w dowolnym pliku → TypeScript kompiluje bez błędów.

**Acceptance Scenarios**:

1. **Given** plik `types/board.ts` istnieje, **When** importuję Board, BoardColumn, Task, **Then** kompilacja bez błędów
2. **Given** Board interface, **When** sprawdzam pola, **Then** ma id, name, description (nullable), columns (BoardColumn[]), createdAt, updatedAt
3. **Given** BoardColumn interface, **When** sprawdzam pola, **Then** ma id, name, order, boardId, tasks (Task[]), createdAt, updatedAt
4. **Given** Task interface, **When** sprawdzam pola, **Then** ma id, title, description (nullable), order, columnId, createdAt, updatedAt

---

### User Story 2 - API service layer for boards, columns, tasks (Priority: P1)

Jako frontend developer chcę rozszerzenie istniejącego api.ts o `boardsApi`, `columnsApi`, `tasksApi`, aby mieć spójny wzorzec wywołań API.

**Why this priority**: API service to warstwa komunikacji — używana przez Redux thunks.

**Independent Test**: Wywołanie dowolnej metody API (np. boardsApi.getAll()) → poprawne request/response mapping.

**Acceptance Scenarios**:

1. **Given** api.ts rozszerzony, **When** importuję boardsApi, **Then** ma metody: getAll, getOne, create, update, remove
2. **Given** api.ts rozszerzony, **When** importuję columnsApi, **Then** ma metody: getByBoard, create, update, remove, reorder
3. **Given** api.ts rozszerzony, **When** importuję tasksApi, **Then** ma metody: getByColumn, create, update, remove, move
4. **Given** istniejący todosApi, **When** sprawdzam api.ts, **Then** todosApi nadal działa bez zmian

---

### User Story 3 - Redux slice for board state management (Priority: P1)

Jako frontend developer chcę boardSlice z Redux Toolkit, aby zarządzać stanem tablic, kolumn i tasków z optimistic updates.

**Why this priority**: Slice to serce state management — łączy UI z API.

**Independent Test**: Dispatch fetchBoards → state.boards wypełniony. Dispatch moveTask → optimistic update w state.

**Acceptance Scenarios**:

1. **Given** boardSlice zarejestrowany w store, **When** dispatch(fetchBoards()), **Then** state.board.boards zawiera listę z API
2. **Given** boardSlice, **When** dispatch(fetchBoard(id)), **Then** state.board.activeBoard zawiera pełny board z columns i tasks
3. **Given** activeBoard z taskami, **When** dispatch(moveTask({...})), **Then** state aktualizowany optimistycznie (before API response)
4. **Given** moveTask rejected, **When** API zwraca błąd, **Then** state reverted do poprzedniego stanu
5. **Given** boardSlice, **When** dispatch(createColumn({...})), **Then** kolumna dodana do activeBoard.columns
6. **Given** boardSlice, **When** dispatch(createTask({...})), **Then** task dodany do odpowiedniej kolumny

---

### Edge Cases

- Co się dzieje gdy API jest niedostępne? → status: 'failed', error message w state
- Co się dzieje gdy moveTask optimistic update a potem API failure? → Revert state do snapshot sprzed move
- Co się dzieje gdy fetchBoard z nieistniejącym ID? → 404 → error w state

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUSI dostarczyć interfejsy Board, BoardColumn, Task w `types/board.ts`
- **FR-002**: Board: id, name, description (string | null), columns (BoardColumn[]), createdAt, updatedAt
- **FR-003**: BoardColumn: id, name, order, boardId, tasks (Task[]), createdAt, updatedAt
- **FR-004**: Task: id, title, description (string | null), order, columnId, createdAt, updatedAt
- **FR-005**: Rozszerzenie `services/api.ts` o boardsApi (getAll, getOne, create, update, remove), columnsApi (getByBoard, create, update, remove, reorder), tasksApi (getByColumn, create, update, remove, move)
- **FR-006**: Istniejący todosApi MUSI pozostać bez zmian
- **FR-007**: boardSlice state: `{ boards: Board[], activeBoard: Board | null, status, error }`
- **FR-008**: Async thunks: fetchBoards, fetchBoard, createBoard, deleteBoard, createColumn, deleteColumn, reorderColumns, createTask, updateTask, deleteTask, moveTask
- **FR-009**: Synchroniczny reducer moveTaskOptimistic do optimistic UI (feature 008)
- **FR-010**: store.ts MUSI zarejestrować boardReducer obok istniejącego todosReducer
- **FR-011**: Wzorzec API: `.then((res) => res.data)` — spójny z istniejącym todosApi

### Key Entities

- **Board** (interface): Pełna tablica z zagnieżdżonymi columns i tasks
- **BoardColumn** (interface): Kolumna z zagnieżdżonymi tasks
- **Task** (interface): Jednostka pracy

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: TypeScript kompiluje bez błędów (`npm run build:web`)
- **SC-002**: Import typów Board, BoardColumn, Task działa w dowolnym komponencie
- **SC-003**: boardsApi, columnsApi, tasksApi mają wszystkie wymagane metody
- **SC-004**: boardSlice zarejestrowany w store — `useAppSelector(state => state.board)` działa
- **SC-005**: Dispatch async thunks aktualizuje state poprawnie (loading → succeeded/failed)
- **SC-006**: moveTaskOptimistic reducer dostępny do optimistic updates
- **SC-007**: Istniejący todosSlice i todosApi działają bez regresji

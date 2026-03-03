# Feature Specification: Frontend Types + API Service Layer

**Feature Branch**: `006-board-types-api`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz typy TypeScript (Board, BoardColumn, Task) i rozszerzenie Axios API service o boardsApi, columnsApi, tasksApi — wzorcem istniejącego api.ts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - TypeScript types for Kanban model (Priority: P1)

Jako frontend developer chcę mieć interfejsy TypeScript (Board, BoardColumn, Task) odzwierciedlające model danych z API, aby zapewnić type safety w całej aplikacji.

**Why this priority**: Typy to fundament — bez nich nie ma type-safe API service ani Redux slice.

**Independent Test**: Importowanie typów w dowolnym pliku → TypeScript kompiluje bez błędów.

**Acceptance Scenarios**:

1. **Given** plik `types/board.ts` istnieje, **When** importuję Board, BoardColumn, Task, **Then** kompilacja bez błędów
2. **Given** Board interface, **When** sprawdzam pola, **Then** ma id, name, description (nullable), columns (BoardColumn[]), createdAt, updatedAt
3. **Given** BoardColumn interface, **When** sprawdzam pola, **Then** ma id, name, order, boardId, tasks (Task[]), createdAt, updatedAt
4. **Given** Task interface, **When** sprawdzam pola, **Then** ma id, title, description (nullable), order, columnId, createdAt, updatedAt

---

### User Story 2 - API service layer for boards, columns, tasks (Priority: P1)

Jako frontend developer chcę rozszerzenie istniejącego api.ts o `boardsApi`, `columnsApi`, `tasksApi`, aby mieć spójny wzorzec wywołań API.

**Why this priority**: API service to warstwa komunikacji — używana przez Redux thunks w feature 007.

**Independent Test**: Wywołanie dowolnej metody API (np. boardsApi.getAll()) → poprawne request/response mapping.

**Acceptance Scenarios**:

1. **Given** api.ts rozszerzony, **When** importuję boardsApi, **Then** ma metody: getAll, getOne, create, update, remove
2. **Given** api.ts rozszerzony, **When** importuję columnsApi, **Then** ma metody: getByBoard, create, update, remove, reorder
3. **Given** api.ts rozszerzony, **When** importuję tasksApi, **Then** ma metody: getByColumn, create, update, remove, move
4. **Given** istniejący todosApi, **When** sprawdzam api.ts, **Then** todosApi nadal działa bez zmian

---

### Edge Cases

- Co się dzieje gdy API zwraca unexpected shape? → TypeScript typy pełnią rolę dokumentacji, runtime validation brak (zaufanie do API)
- Co się dzieje gdy dodamy nowe pole do API? → Wystarczy zaktualizować interface + api method

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUSI dostarczyć interfejsy Board, BoardColumn, Task w `types/board.ts`
- **FR-002**: Board: id, name, description (string | null), columns (BoardColumn[]), createdAt, updatedAt
- **FR-003**: BoardColumn: id, name, order, boardId, tasks (Task[]), createdAt, updatedAt
- **FR-004**: Task: id, title, description (string | null), order, columnId, createdAt, updatedAt
- **FR-005**: Rozszerzenie `services/api.ts` o boardsApi (getAll, getOne, create, update, remove), columnsApi (getByBoard, getOne, create, update, remove, reorder), tasksApi (getByColumn, getOne, create, update, remove, move)
- **FR-006**: Istniejący todosApi MUSI pozostać bez zmian
- **FR-007**: Wzorzec API: `.then((res) => res.data)` — spójny z istniejącym todosApi
- **FR-008**: DTO typy pomocnicze: CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto, CreateTaskDto, UpdateTaskDto, MoveTaskDto, ReorderColumnsDto

### Key Entities

- **Board** (interface): Pełna tablica z zagnieżdżonymi columns i tasks
- **BoardColumn** (interface): Kolumna z zagnieżdżonymi tasks
- **Task** (interface): Jednostka pracy

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: TypeScript kompiluje bez błędów (`npm run build:web`)
- **SC-002**: Import typów Board, BoardColumn, Task działa w dowolnym komponencie
- **SC-003**: boardsApi, columnsApi, tasksApi mają wszystkie wymagane metody
- **SC-004**: Istniejący todosApi działa bez regresji
- **SC-005**: Każda metoda API poprawnie typowana (argument DTO → response type)

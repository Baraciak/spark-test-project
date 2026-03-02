# Feature Specification: API Smoke Tests

**Feature Branch**: `005-api-smoke-test`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "API smoke tests - E2E tests for all existing API endpoints"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Health Check E2E Test (Priority: P1)

Jako deweloper chcę test E2E dla health check endpoint `/`, aby potwierdzić że cała konfiguracja testowa działa poprawnie.

**Why this priority**: Najprostszy test — weryfikuje setup. Ustala wzorzec dla reszty plików.

**Independent Test**: `npm test -w apps/api -- --testPathPattern=app.e2e-spec`

**Acceptance Scenarios**:

1. **Given** running app, **When** GET `/`, **Then** 200 + `{ status: "ok", timestamp: <string> }`

---

### User Story 2 - CRUD Smoke Tests for Todo Module (Priority: P1)

Jako deweloper chcę E2E testy pokrywające pełny cykl CRUD dla modułu Todo (POST, GET all, GET by id, PATCH, DELETE) + walidację, aby mieć pewność że kontroler poprawnie obsługuje requesty.

**Why this priority**: Todo to najprostszy moduł — ustala wzorzec testowy.

**Independent Test**: `npm test -w apps/api -- --testPathPattern=todos.e2e-spec`

**Acceptance Scenarios**:

1. **Given** empty state, **When** POST `/todos` with `{ title: "Test" }`, **Then** 201 + body contains `id`, `title`, `completed: false`
2. **Given** existing todos, **When** GET `/todos`, **Then** 200 + array of todos
3. **Given** existing todo, **When** GET `/todos/:id`, **Then** 200 + todo object
4. **Given** existing todo, **When** PATCH `/todos/:id` with `{ completed: true }`, **Then** 200 + updated todo
5. **Given** existing todo, **When** DELETE `/todos/:id`, **Then** 200
6. **Given** any POST, **When** send empty body `{}`, **Then** 400
7. **Given** GET by id, **When** send `"not-a-uuid"`, **Then** 400
8. **Given** GET by id, **When** send non-existent UUID, **Then** 404

---

### User Story 3 - CRUD Smoke Tests for Board Module (Priority: P1)

Jako deweloper chcę E2E testy dla modułu Board (POST, GET all, GET by id z eager-loaded columns, PATCH, DELETE) + walidację.

**Why this priority**: Board to root entity Kanban — fundament dla columns i tasks.

**Independent Test**: `npm test -w apps/api -- --testPathPattern=boards.e2e-spec`

**Acceptance Scenarios**:

1. **Given** no boards, **When** POST `/boards` with `{ name: "Sprint 1" }`, **Then** 201 + board object
2. **Given** existing boards, **When** GET `/boards`, **Then** 200 + array
3. **Given** existing board, **When** GET `/boards/:id`, **Then** 200 + board with `columns` array
4. **Given** existing board, **When** PATCH `/boards/:id` with `{ name: "Updated" }`, **Then** 200 + updated
5. **Given** existing board, **When** DELETE `/boards/:id`, **Then** 200
6. **Given** POST, **When** empty body, **Then** 400
7. **Given** GET by id, **When** invalid UUID, **Then** 400
8. **Given** GET by id, **When** non-existent UUID, **Then** 404

---

### User Story 4 - CRUD + Reorder Smoke Tests for Column Module (Priority: P1)

Jako deweloper chcę E2E testy dla modułu Column — CRUD plus transakcyjny reorder — plus walidację.

**Why this priority**: Columns mają złożoną logikę reorder wymagającą testów.

**Independent Test**: `npm test -w apps/api -- --testPathPattern=columns.e2e-spec`

**Acceptance Scenarios**:

1. **Given** existing board, **When** POST `/columns` with `{ name: "To Do", boardId: "<uuid>" }`, **Then** 201 + column with auto-assigned `order`
2. **Given** board with columns, **When** GET `/boards/:boardId/columns`, **Then** 200 + sorted by order ASC
3. **Given** existing column, **When** GET `/columns/:id`, **Then** 200 + column object
4. **Given** existing column, **When** PATCH `/columns/:id` with `{ name: "Done" }`, **Then** 200 + updated
5. **Given** existing column, **When** DELETE `/columns/:id`, **Then** 200
6. **Given** board with columns, **When** PATCH `/boards/:boardId/columns/reorder` with reversed columnIds, **Then** 200 + columns in new order
7. **Given** POST, **When** missing boardId, **Then** 400
8. **Given** reorder, **When** duplicate columnIds, **Then** 400
9. **Given** POST, **When** non-existent boardId, **Then** 404

---

### User Story 5 - CRUD + Move Smoke Tests for Task Module (Priority: P1)

Jako deweloper chcę E2E testy dla modułu Task — CRUD plus transakcyjny move — plus walidację.

**Why this priority**: Task.move to najbardziej złożona operacja w API.

**Independent Test**: `npm test -w apps/api -- --testPathPattern=tasks.e2e-spec`

**Acceptance Scenarios**:

1. **Given** existing column, **When** POST `/tasks` with `{ title: "Login page", columnId: "<uuid>" }`, **Then** 201 + task with auto-assigned `order`
2. **Given** column with tasks, **When** GET `/columns/:columnId/tasks`, **Then** 200 + sorted by order ASC
3. **Given** existing task, **When** GET `/tasks/:id`, **Then** 200 + task object
4. **Given** existing task, **When** PATCH `/tasks/:id` with `{ title: "Updated" }`, **Then** 200 + updated
5. **Given** existing task, **When** DELETE `/tasks/:id`, **Then** 200
6. **Given** task in column A and column B exists, **When** PATCH `/tasks/:id/move` with `{ columnId: B, order: 0 }`, **Then** 200 + moved task
7. **Given** POST, **When** missing columnId, **Then** 400
8. **Given** move, **When** invalid order (negative), **Then** 400
9. **Given** POST, **When** non-existent columnId, **Then** 404

---

### Edge Cases

- POST z dodatkowym polem (`{ title: "X", extra: "Y" }`) → whitelist powinno usunąć `extra`, 201
- PATCH z pustym body `{}` → 200, bez zmian
- Reorder z niepełną listą columnIds → 400
- Reorder z columnId z innego boarda → 400

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Każdy moduł API (App, Todo, Board, Column, Task) MUSI mieć plik E2E test (`*.e2e-spec.ts`)
- **FR-002**: Testy MUSZĄ używać Supertest z mockowanymi serwisami (bez bazy danych)
- **FR-003**: Testy MUSZĄ pokrywać happy path dla każdej operacji CRUD + specjalne operacje (reorder, move)
- **FR-004**: Testy MUSZĄ weryfikować kody HTTP (201/200/400/404)
- **FR-005**: Testy MUSZĄ weryfikować strukturę response body
- **FR-006**: Testy walidacji MUSZĄ pokrywać: brakujące wymagane pola, nieprawidłowe UUID, nieistniejące zasoby
- **FR-007**: Testy MUSZĄ konfigurować globalny ValidationPipe (whitelist + transform) identycznie jak `main.ts`
- **FR-008**: Testy MUSZĄ przechodzić z `npm test -w apps/api`
- **FR-009**: Brak zmian w kodzie produkcyjnym — tylko nowe pliki testowe

### Key Entities *(already exist, no changes)*

- **Todo**: Simple CRUD entity (title, completed)
- **Board**: Root Kanban entity (name, description, columns[])
- **BoardColumn**: Kanban column (name, order, boardId, tasks[])
- **Task**: Kanban task (title, description, order, columnId)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm test -w apps/api` przechodzi z 0 failures
- **SC-002**: Min. 1 test per endpoint — 22 endpointy → min. 22 test cases
- **SC-003**: Min. 3 scenariusze walidacji/błędów per moduł (todo, board, column, task)
- **SC-004**: Czas wykonania testów: poniżej 30s (mocki, brak I/O bazy)
- **SC-005**: Brak zmian w kodzie produkcyjnym — tylko nowe pliki testowe

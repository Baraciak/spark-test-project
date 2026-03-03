# Feature Specification: Task Entity & CRUD API + Move Endpoint

**Feature Branch**: `004-task-entity-api`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz encję Task (extends BaseEntity) z CRUD API i dedykowanym endpointem move — title, description, order, relacja ManyToOne do BoardColumn, walidacja kolumny przez ColumnsService, transakcyjne przenoszenie między kolumnami (queryRunner)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a task in a column (Priority: P1)

Jako developer chcę dodać task do kolumny tablicy Kanban, aby śledzić jednostki pracy.

**Why this priority**: Taski to główna jednostka pracy w Kanban — core funkcjonalność.

**Independent Test**: POST /tasks z columnId i title → task z auto-assigned order.

**Acceptance Scenarios**:

1. **Given** istnieje kolumna X, **When** POST /tasks z `{ "title": "Login page", "columnId": "X" }`, **Then** zwraca 201 z task, order = 0
2. **Given** kolumna X ma 3 taski, **When** POST /tasks z columnId=X, **Then** nowy task ma order = 3
3. **Given** POST /tasks z `{ "title": "Task", "description": "Details", "columnId": "X" }`, **Then** task ma description
4. **Given** nie istnieje kolumna Y, **When** POST /tasks z columnId=Y, **Then** zwraca 404
5. **Given** POST /tasks bez title, **Then** zwraca 400

---

### User Story 2 - List tasks for a column (Priority: P1)

Jako developer chcę pobrać taski kolumny posortowane po order ASC.

**Why this priority**: Lista tasków to zawartość każdej kolumny w widoku Kanban.

**Independent Test**: GET /columns/:columnId/tasks → tablica tasków sorted by order.

**Acceptance Scenarios**:

1. **Given** kolumna X ma 5 tasków, **When** GET /columns/X/tasks, **Then** zwraca 200 z 5 taskami posortowanymi po order ASC
2. **Given** kolumna X jest pusta, **When** GET /columns/X/tasks, **Then** zwraca 200 z `[]`

---

### User Story 3 - Move task between columns (Priority: P1)

Jako developer chcę przenieść task z jednej kolumny do innej na określoną pozycję — operacja transakcyjna.

**Why this priority**: Move to esencja Kanban — przenoszenie tasków przez etapy workflow.

**Independent Test**: PATCH /tasks/:id/move z columnId + order → task w nowej kolumnie, order zaktualizowane w obu kolumnach.

**Acceptance Scenarios**:

1. **Given** task T w kolumnie A (order 1), kolumna B pusta, **When** PATCH /tasks/T/move z `{ "columnId": "B", "order": 0 }`, **Then** task T jest w kolumnie B z order 0, luka w kolumnie A zamknięta
2. **Given** task T w kolumnie A, kolumna B ma taski [X(0), Y(1)], **When** move T do B na order 1, **Then** T jest w B(1), Y przesunięty na B(2)
3. **Given** task T w kolumnie A (order 0), A ma [T(0), U(1), V(2)], **When** move T w tej samej kolumnie A na order 2, **Then** A ma [U(0), V(1), T(2)]
4. **Given** nie istnieje target kolumna Y, **When** move do Y, **Then** zwraca 404
5. **Given** operacja move, **When** błąd w środku transakcji, **Then** rollback — żadne zmiany nie zapisane

---

### User Story 4 - Update a task (Priority: P2)

Jako developer chcę edytować title/description taska.

**Why this priority**: Edycja taska to podstawowa operacja ale drugorzędna względem tworzenia i przenoszenia.

**Independent Test**: PATCH /tasks/:id z nowymi danymi → zaktualizowany task.

**Acceptance Scenarios**:

1. **Given** istnieje task X, **When** PATCH /tasks/X z `{ "title": "New title" }`, **Then** zwraca 200 z nowym title
2. **Given** nie istnieje task Y, **When** PATCH /tasks/Y, **Then** zwraca 404

---

### User Story 5 - Delete a task (Priority: P2)

Jako developer chcę usunąć task z kolumny.

**Why this priority**: Usuwanie potrzebne do zarządzania taskami.

**Independent Test**: DELETE /tasks/:id → 200, task usunięty.

**Acceptance Scenarios**:

1. **Given** istnieje task X, **When** DELETE /tasks/X, **Then** zwraca 200
2. **Given** nie istnieje task Y, **When** DELETE /tasks/Y, **Then** zwraca 404

---

### Edge Cases

- Co się dzieje gdy move task z order większym niż liczba tasków w target kolumnie? → Task ląduje na końcu
- Co się dzieje przy move taska w ramach tej samej kolumny? → Reorder w ramach jednej kolumny
- Co się dzieje gdy usuniesz kolumnę z taskami? → CASCADE delete — taski usunięte
- Równoczesny move dwóch tasków? → Transakcja queryRunner zapewnia atomowość per-move

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUSI dostarczyć encję Task (extends BaseEntity) z polami: title (string, required), description (text, nullable), order (int, default 0), columnId (FK → board_columns)
- **FR-002**: Relacja ManyToOne do BoardColumn z `onDelete: CASCADE`
- **FR-003**: TasksService MUSI wstrzykiwać ColumnsService do walidacji istnienia kolumny (SOLID DI)
- **FR-004**: `create()` MUSI auto-assign order = max(order w kolumnie) + 1
- **FR-005**: `findAllByColumn(columnId)` MUSI sortować po order ASC
- **FR-006**: `move(id, moveDto)` MUSI być transakcyjny (DataSource.createQueryRunner) — shift orders w target, close gap w source, update task
- **FR-007**: Endpointy: POST /tasks, GET /columns/:columnId/tasks, GET /tasks/:id, PATCH /tasks/:id, DELETE /tasks/:id, PATCH /tasks/:id/move
- **FR-008**: Swagger dekoratory na każdym endpoincie (@ApiTags('tasks'))
- **FR-009**: TasksModule MUSI importować ColumnsModule
- **FR-010**: Aktualizacja BoardColumn — dodać relację @OneToMany → Task
- **FR-011**: Board findOne MUSI eager loadować pełne drzewo board → columns → tasks (posortowane)
- **FR-012**: MoveTaskDto: columnId (UUID, required), order (int >= 0, required)
- **FR-013**: Migracja TypeORM tworząca tabelę `tasks` z FK do `board_columns`

### Key Entities

- **Task**: Jednostka pracy Kanban — title (string), description (text nullable), order (int), columnId (FK). Relacja ManyToOne → BoardColumn.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: POST /tasks z poprawnym columnId zwraca 201 z auto-assigned order
- **SC-002**: PATCH /tasks/:id/move przenosi task między kolumnami transakcyjnie — order w obu kolumnach poprawny
- **SC-003**: Move w ramach tej samej kolumny poprawnie reorderuje taski
- **SC-004**: GET /boards/:id zwraca pełne drzewo board → columns (order ASC) → tasks (order ASC)
- **SC-005**: Rollback transakcji move przy błędzie — brak częściowych zmian
- **SC-006**: Swagger UI wyświetla tag "tasks" z 6 endpointami
- **SC-007**: `npm test -w apps/api` przechodzi po implementacji

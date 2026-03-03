# Feature Specification: BoardColumn Entity & CRUD API

**Feature Branch**: `003-column-entity-api`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz encję BoardColumn (extends BaseEntity) z CRUD API — pole order do pozycjonowania, relacja ManyToOne do Board z CASCADE delete, walidacja istnienia boarda przez wstrzyknięty BoardsService (SOLID DI), eksport ColumnsService"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a column in a board (Priority: P1)

Jako developer chcę dodać kolumnę do tablicy (np. "To Do", "In Progress", "Done"), aby organizować taski.

**Why this priority**: Kolumny to podstawowa struktura tablicy Kanban — bez nich nie ma tasków.

**Independent Test**: POST /columns z boardId i name → kolumna z auto-assigned order.

**Acceptance Scenarios**:

1. **Given** istnieje board X, **When** POST /columns z `{ "name": "To Do", "boardId": "X" }`, **Then** zwraca 201 z kolumną, order = 0
2. **Given** board X ma 2 kolumny (order 0, 1), **When** POST /columns z boardId=X, **Then** nowa kolumna ma order = 2
3. **Given** nie istnieje board Y, **When** POST /columns z boardId=Y, **Then** zwraca 404 "Board #Y not found"
4. **Given** API działa, **When** POST /columns bez boardId, **Then** zwraca 400 (walidacja DTO)

---

### User Story 2 - List columns for a board (Priority: P1)

Jako developer chcę pobrać wszystkie kolumny tablicy posortowane po kolejności (order ASC).

**Why this priority**: Lista kolumn to struktura widoku Kanban.

**Independent Test**: GET /boards/:boardId/columns → tablica kolumn sorted by order.

**Acceptance Scenarios**:

1. **Given** board X ma 3 kolumny, **When** GET /boards/X/columns, **Then** zwraca 200 z 3 kolumnami posortowanymi po order ASC
2. **Given** board X nie ma kolumn, **When** GET /boards/X/columns, **Then** zwraca 200 z `[]`

---

### User Story 3 - Reorder columns within a board (Priority: P2)

Jako developer chcę zmienić kolejność kolumn w tablicy (np. przenieść "Done" na drugie miejsce).

**Why this priority**: Reorder jest ważny dla UX ale drugorzędny względem CRUD.

**Independent Test**: PATCH /boards/:boardId/columns/reorder z tablicą columnIds → kolumny z nowymi order values.

**Acceptance Scenarios**:

1. **Given** board X ma kolumny [A(0), B(1), C(2)], **When** PATCH reorder z [C, A, B], **Then** kolumny mają order: C=0, A=1, B=2
2. **Given** nie istnieje board Y, **When** PATCH reorder, **Then** zwraca 404
3. **Given** board X ma kolumny [A, B, C], **When** PATCH reorder z [A, D] (D nie należy do boarda X), **Then** zwraca 400 "Invalid column IDs"
4. **Given** board X ma kolumny [A, B, C], **When** PATCH reorder z [A, B] (brak C), **Then** zwraca 400 "All column IDs must be provided"
5. **Given** board X ma kolumny [A, B, C], **When** PATCH reorder z [], **Then** zwraca 400 (walidacja DTO — ArrayNotEmpty)

---

### User Story 4 - Update a column (Priority: P2)

Jako developer chcę zmienić nazwę kolumny.

**Why this priority**: Edycja nazwy to podstawowa operacja zarządzania.

**Independent Test**: PATCH /columns/:id z nową nazwą → zaktualizowana kolumna.

**Acceptance Scenarios**:

1. **Given** istnieje kolumna X, **When** PATCH /columns/X z `{ "name": "In Review" }`, **Then** zwraca 200 z nową nazwą
2. **Given** nie istnieje kolumna Y, **When** PATCH /columns/Y, **Then** zwraca 404

---

### User Story 5 - Delete a column (Priority: P2)

Jako developer chcę usunąć kolumnę z tablicy.

**Why this priority**: Usuwanie potrzebne do zarządzania strukturą tablicy.

**Independent Test**: DELETE /columns/:id → 200, kolumna usunięta.

**Acceptance Scenarios**:

1. **Given** istnieje kolumna X, **When** DELETE /columns/X, **Then** zwraca 200
2. **Given** kolumna X ma taski, **When** DELETE /columns/X, **Then** taski również usunięte (CASCADE)

---

### Edge Cases

- Co się dzieje gdy boardId w CreateColumnDto nie istnieje? → NotFoundException z BoardsService
- Co się dzieje przy reorder z niepełną listą columnIds? → 400 BadRequest "All column IDs must be provided"
- Co się dzieje przy reorder z columnIds z innego boarda? → 400 BadRequest "Invalid column IDs"
- Co się dzieje przy reorder z duplikatami columnIds? → 400 BadRequest "Duplicate column IDs"
- Co się dzieje przy reorder z pustą tablicą? → 400 BadRequest (ArrayNotEmpty walidacja DTO)
- Dwie kolumny z tą samą nazwą w jednym boardzie? → Dozwolone (brak unique constraint)
- Nazwa kolumny dłuższa niż 255 znaków? → 400 BadRequest (MaxLength walidacja DTO)
- Usunięcie boarda kaskadowo usuwa jego kolumny? → Tak (onDelete: CASCADE)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUSI dostarczyć encję BoardColumn (extends BaseEntity) z polami: name (string, max 255), order (int, default 0), boardId (FK → boards)
- **FR-002**: Relacja ManyToOne do Board z `onDelete: CASCADE` — usunięcie boarda kasuje jego kolumny
- **FR-003**: Relacja OneToMany do Task (przygotowana na feature 004) z `cascade: true`
- **FR-004**: ColumnsService MUSI wstrzykiwać BoardsService do walidacji istnienia boarda (SOLID DI)
- **FR-005**: `create()` MUSI auto-assign order = max(order w boardzie) + 1
- **FR-006**: `findAllByBoard(boardId)` MUSI sortować po order ASC
- **FR-007**: `reorder(boardId, columnIds[])` MUSI walidować: (a) wszystkie kolumny boarda muszą być w tablicy, (b) brak duplikatów, (c) wszystkie ID należą do tego boarda. Następnie bulk-update order kolumn w transakcji.
- **FR-008**: Endpointy: POST /columns, GET /boards/:boardId/columns, GET /columns/:id, PATCH /columns/:id, DELETE /columns/:id, PATCH /boards/:boardId/columns/reorder
- **FR-009**: Swagger dekoratory na każdym endpoincie (@ApiTags('columns'), @ApiOperation, @ApiResponse)
- **FR-010**: ColumnsModule MUSI importować BoardsModule i eksportować ColumnsService
- **FR-011**: Aktualizacja encji Board — dodać relację @OneToMany → BoardColumn
- **FR-012**: Board findOne MUSI eager loadować columns posortowane po order ASC
- **FR-013**: Migracja TypeORM tworząca tabelę `board_columns` z FK do `boards`

### Key Entities

- **BoardColumn**: Kolumna tablicy Kanban — name (string, max 255), order (int), boardId (FK). Relacja ManyToOne → Board, OneToMany → Task.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: POST /columns z boardId istniejącego boarda zwraca 201 z auto-assigned order
- **SC-002**: POST /columns z nieistniejącym boardId zwraca 404
- **SC-003**: GET /boards/:boardId/columns zwraca kolumny posortowane po order ASC
- **SC-004**: PATCH reorder zmienia order kolumn zgodnie z podaną tablicą
- **SC-005**: PATCH reorder z nieprawidłowymi columnIds zwraca 400
- **SC-006**: DELETE board kaskadowo usuwa jego kolumny
- **SC-007**: GET /boards/:id zwraca board z załadowanymi kolumnami (eager load)
- **SC-008**: Swagger UI wyświetla tag "columns" z endpointami
- **SC-009**: `npm test -w apps/api` przechodzi po implementacji

# Feature Specification: Board Entity & CRUD API

**Feature Branch**: `002-board-entity-api`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz abstrakcyjną BaseEntity z wspólnymi polami (id UUID, createdAt, updatedAt) w common/entities/, następnie encję Board z pełnym CRUD REST API — moduł NestJS z controller/service/DTO, Swagger docs, eksport serwisu"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a new board (Priority: P1)

Jako developer chcę utworzyć nową tablicę Kanban przez API, aby móc organizować zadania w kolumnach.

**Why this priority**: Tworzenie tablicy to fundamentalna operacja — bez niej nie istnieją kolumny ani taski.

**Independent Test**: Wysłanie POST /boards z nazwą → otrzymanie board z UUID, name, timestamps.

**Acceptance Scenarios**:

1. **Given** API działa, **When** POST /boards z `{ "name": "Sprint 1" }`, **Then** zwraca 201 z board zawierającym id (UUID), name, createdAt, updatedAt
2. **Given** API działa, **When** POST /boards z `{ "name": "Sprint 1", "description": "First sprint" }`, **Then** zwraca 201 z board zawierającym description
3. **Given** API działa, **When** POST /boards z pustym body `{}`, **Then** zwraca 400 z walidacji (name required)

---

### User Story 2 - List all boards (Priority: P1)

Jako developer chcę pobrać listę wszystkich tablic posortowanych od najnowszej.

**Why this priority**: Lista tablic to punkt wejścia do aplikacji.

**Independent Test**: GET /boards → tablica JSON posortowana po createdAt DESC.

**Acceptance Scenarios**:

1. **Given** istnieją 3 boardy, **When** GET /boards, **Then** zwraca 200 z tablicą 3 elementów posortowanych DESC po createdAt
2. **Given** brak boardów, **When** GET /boards, **Then** zwraca 200 z pustą tablicą `[]`

---

### User Story 3 - Get single board with details (Priority: P1)

Jako developer chcę pobrać szczegóły tablicy po ID, aby wyświetlić jej zawartość.

**Why this priority**: Widok szczegółów to podstawa do wyświetlenia kolumn i tasków w przyszłości.

**Independent Test**: GET /boards/:id → board z relacjami (columns, tasks — puste na tym etapie).

**Acceptance Scenarios**:

1. **Given** istnieje board z ID X, **When** GET /boards/X, **Then** zwraca 200 z board i pustą tablicą columns
2. **Given** nie istnieje board z ID Y, **When** GET /boards/Y, **Then** zwraca 404 "Board #Y not found"
3. **Given** podany invalid UUID, **When** GET /boards/not-uuid, **Then** zwraca 400 (ParseUUIDPipe)

---

### User Story 4 - Update a board (Priority: P2)

Jako developer chcę aktualizować nazwę/opis tablicy.

**Why this priority**: Edycja jest ważna ale drugorzędna względem tworzenia i odczytu.

**Independent Test**: PATCH /boards/:id z nowymi danymi → zaktualizowany board.

**Acceptance Scenarios**:

1. **Given** istnieje board X, **When** PATCH /boards/X z `{ "name": "Sprint 2" }`, **Then** zwraca 200 z zaktualizowaną nazwą
2. **Given** istnieje board X, **When** PATCH /boards/X z `{ "description": "New desc" }`, **Then** zwraca 200 z zaktualizowanym opisem
3. **Given** nie istnieje board Y, **When** PATCH /boards/Y, **Then** zwraca 404

---

### User Story 5 - Delete a board (Priority: P2)

Jako developer chcę usunąć tablicę.

**Why this priority**: Usuwanie potrzebne do zarządzania cyklem życia tablic.

**Independent Test**: DELETE /boards/:id → 200, ponowny GET → 404.

**Acceptance Scenarios**:

1. **Given** istnieje board X, **When** DELETE /boards/X, **Then** zwraca 200
2. **Given** board X usunięty, **When** GET /boards/X, **Then** zwraca 404
3. **Given** nie istnieje board Y, **When** DELETE /boards/Y, **Then** zwraca 404

---

### Edge Cases

- Co się dzieje gdy name to pusty string lub same spacje? → Walidacja @IsNotEmpty
- Co się dzieje gdy description to null vs undefined? → Oba dopuszczalne (pole optional nullable)
- Co się dzieje przy duplikowanej nazwie? → Dozwolone (brak unique constraint na name)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUSI dostarczyć abstract BaseEntity z polami: id (UUID auto-generated), createdAt (auto), updatedAt (auto) w `common/entities/base.entity.ts`
- **FR-002**: System MUSI dostarczyć encję Board (extends BaseEntity) z polami: name (string, required), description (string, nullable)
- **FR-003**: System MUSI dostarczyć CRUD endpointy: POST /boards, GET /boards, GET /boards/:id, PATCH /boards/:id, DELETE /boards/:id
- **FR-004**: System MUSI walidować DTO przez class-validator: CreateBoardDto (name required), UpdateBoardDto (all optional)
- **FR-005**: System MUSI mieć Swagger dekoratory (@ApiTags, @ApiOperation, @ApiResponse) na każdym endpoincie
- **FR-006**: BoardsModule MUSI eksportować BoardsService (potrzebny w przyszłych modułach — SOLID DI)
- **FR-007**: Board findAll MUSI sortować po createdAt DESC
- **FR-008**: Board entity MUSI być przygotowany na relację OneToMany → BoardColumn (relacja zostanie dodana w feature 003 — w tym feature findOne zwraca board bez columns)
- **FR-009**: System MUSI wygenerować migrację TypeORM tworzącą tabelę `boards`

### Key Entities

- **BaseEntity** (abstract): Wspólna klasa bazowa — id (UUID PK), createdAt, updatedAt. Dziedziczą po niej Board, BoardColumn, Task.
- **Board**: Tablica Kanban — name (string), description (string nullable). Relacja OneToMany → BoardColumn (zostanie dodana z `cascade: true` w feature 003).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: POST /boards z poprawnym DTO zwraca 201 z kompletnym obiektem Board
- **SC-002**: GET /boards zwraca listę posortowaną po createdAt DESC
- **SC-003**: GET /boards/:id zwraca board (relacja columns zostanie dodana w feature 003)
- **SC-004**: Swagger UI (localhost:3001/docs) wyświetla tag "boards" z 5 endpointami
- **SC-005**: Migracja tworzy tabelę `boards` z kolumnami id, name, description, createdAt, updatedAt
- **SC-006**: `npm test -w apps/api` przechodzi po implementacji
- **SC-007**: BoardsService jest dostępny do wstrzyknięcia w innych modułach (exports)

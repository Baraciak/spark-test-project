# Feature Specification: API Integration Smoke Test

**Feature Branch**: `005-api-smoke-test`
**Created**: 2026-03-02
**Status**: Draft
**Input**: Verification gate — walidacja API z features 002-004 przed rozpoczęciem pracy frontendowej. Smoke test przez Swagger UI i curl/Postman.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verify full Board → Column → Task tree (Priority: P1)

Jako developer chcę zweryfikować, że API zwraca pełne drzewo board → columns → tasks, aby upewnić się, że frontend otrzyma kompletne dane.

**Why this priority**: Pełne drzewo to fundament widoku Kanban — jeśli eager loading nie działa, frontend nie wyświetli tablicy.

**Independent Test**: Utworzenie board + columns + tasks → GET /boards/:id zwraca pełną strukturę.

**Acceptance Scenarios**:

1. **Given** pusty system, **When** POST /boards z `{ "name": "Test Board" }`, **Then** 201 z UUID
2. **Given** board X, **When** POST /columns z `{ "name": "To Do", "boardId": "X" }` × 3 kolumny, **Then** 201 z auto-assigned order 0, 1, 2
3. **Given** kolumna A, **When** POST /tasks z `{ "title": "Task 1", "columnId": "A" }` × 3 taski, **Then** 201 z order 0, 1, 2
4. **Given** pełne drzewo, **When** GET /boards/X, **Then** board z columns (order ASC) z tasks (order ASC) — pełna struktura zagnieżdżona

---

### User Story 2 - Verify move task between columns (Priority: P1)

Jako developer chcę zweryfikować transakcyjne przenoszenie tasków, aby mieć pewność, że drag & drop na frontendzie będzie miał solidne API.

**Why this priority**: Move to najtrudniejsza operacja — transakcyjność i reorder muszą działać poprawnie.

**Independent Test**: Move task z kolumny A na pozycję 1 w kolumnie B → order poprawny w obu kolumnach.

**Acceptance Scenarios**:

1. **Given** kolumna A z taskami [T1(0), T2(1), T3(2)], kolumna B pusta, **When** PATCH /tasks/T2/move z `{ "columnId": "B", "order": 0 }`, **Then** A=[T1(0), T3(1)], B=[T2(0)]
2. **Given** kolumna A z [T1(0)], kolumna B z [T4(0), T5(1)], **When** move T1 do B na order 1, **Then** A=[], B=[T4(0), T1(1), T5(2)]
3. **Given** kolumna A z [T1(0), T2(1), T3(2)], **When** move T1 w tej samej A na order 2, **Then** A=[T2(0), T3(1), T1(2)]

---

### User Story 3 - Verify cascade delete (Priority: P1)

Jako developer chcę zweryfikować, że usunięcie boarda kaskadowo usuwa kolumny i taski.

**Why this priority**: Cascade delete to operacja destrukcyjna — musi działać poprawnie lub spowoduje orphaned records.

**Independent Test**: DELETE /boards/:id → GET /boards/:id zwraca 404, kolumny i taski nieistniejące.

**Acceptance Scenarios**:

1. **Given** board X z kolumnami i taskami, **When** DELETE /boards/X, **Then** 200
2. **Given** board X usunięty, **When** GET /boards/X, **Then** 404
3. **Given** kolumna A należała do board X, **When** GET /columns/A, **Then** 404 (kaskadowo usunięta)

---

### User Story 4 - Verify Swagger documentation (Priority: P2)

Jako developer chcę sprawdzić, że Swagger UI poprawnie dokumentuje wszystkie endpointy.

**Why this priority**: Swagger to kontrakt API — frontend developer opiera się na nim.

**Independent Test**: Otwarcie localhost:3001/docs → widoczne tagi boards, columns, tasks z pełną dokumentacją.

**Acceptance Scenarios**:

1. **Given** Swagger UI, **When** otwieram /docs, **Then** widzę tag "boards" z 5 endpointami
2. **Given** Swagger UI, **When** otwieram /docs, **Then** widzę tag "columns" z 6 endpointami (w tym reorder)
3. **Given** Swagger UI, **When** otwieram /docs, **Then** widzę tag "tasks" z 6 endpointami (w tym move)
4. **Given** Swagger UI, **When** sprawdzam schemas, **Then** DTO i response models poprawnie opisane

---

### Edge Cases

- Co się dzieje przy move taska z order > liczba tasków? → Task ląduje na końcu
- Co się dzieje przy POST /columns z nieistniejącym boardId? → 404 z BoardsService
- Co się dzieje przy invalid UUID w parametrze? → 400 z ParseUUIDPipe

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUSI przejść pełny flow: create board → create columns → create tasks → GET full tree → verify structure
- **FR-002**: System MUSI poprawnie wykonać move task między kolumnami z prawidłowym reorder
- **FR-003**: System MUSI poprawnie wykonać move task w ramach tej samej kolumny
- **FR-004**: System MUSI kaskadowo usunąć kolumny i taski przy DELETE board
- **FR-005**: Swagger UI MUSI wyświetlać tagi boards, columns, tasks z kompletną dokumentacją
- **FR-006**: Wszystkie walidacje DTO MUSZĄ zwracać 400 z czytelnym komunikatem
- **FR-007**: Wszystkie 404 MUSZĄ zwracać czytelne komunikaty (np. "Board #uuid not found")

### Key Entities

- Brak nowych encji — feature weryfikuje istniejące Board, BoardColumn, Task

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pełny flow create → read tree działa end-to-end
- **SC-002**: Move task między kolumnami — order poprawny w obu kolumnach
- **SC-003**: Move task w ramach kolumny — reorder poprawny
- **SC-004**: CASCADE delete board → kolumny i taski usunięte
- **SC-005**: Swagger UI kompletny — 3 tagi, ~17 endpointów
- **SC-006**: `npm test -w apps/api` przechodzi
- **SC-007**: Brak orphaned records po operacjach delete

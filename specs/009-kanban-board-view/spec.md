# Feature Specification: Kanban Board View (/boards/[id])

**Feature Branch**: `009-kanban-board-view`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz widok tablicy Kanban na /boards/[id] z poziomym layoutem kolumn, kartami tasków, formularzem dodawania kolumn i tasków — styl iOS glass"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Kanban board with columns and tasks (Priority: P1)

Jako użytkownik chcę widzieć tablicę Kanban z kolumnami ułożonymi poziomo i kartami tasków w każdej kolumnie.

**Why this priority**: Widok Kanban to główny widok aplikacji — bez niego tablica jest bezużyteczna.

**Independent Test**: Nawigacja do /boards/[id] → widoczne kolumny poziomo z taskami.

**Acceptance Scenarios**:

1. **Given** board z 3 kolumnami i taskami, **When** otwieram /boards/[id], **Then** widzę 3 kolumny poziomo z taskami w każdej
2. **Given** board bez kolumn, **When** otwieram /boards/[id], **Then** widzę empty state + formularz "Add Column"
3. **Given** kolumna z 5 taskami, **When** widzę kolumnę, **Then** taski posortowane po order, scrollowalne
4. **Given** strona się ładuje, **When** fetchBoard in progress, **Then** widzę loading spinner
5. **Given** board nie istnieje, **When** otwieram /boards/invalid-id, **Then** widzę error state

---

### User Story 2 - Add a new column to the board (Priority: P1)

Jako użytkownik chcę dodać nową kolumnę do tablicy (np. "To Do", "In Progress", "Done").

**Why this priority**: Tworzenie kolumn to setup tablicy — bez kolumn nie ma tasków.

**Independent Test**: Klik "Add Column" → wpisanie nazwy → nowa kolumna pojawia się na tablicy.

**Acceptance Scenarios**:

1. **Given** tablica, **When** klikam "Add Column" i wpisuję "To Do", **Then** nowa kolumna pojawia się na końcu
2. **Given** formularz AddColumnForm, **When** submit z pustym polem, **Then** brak akcji (button disabled)
3. **Given** submit succeeds, **When** API potwierdzi, **Then** input wyczyszczony

---

### User Story 3 - Add a task to a column (Priority: P1)

Jako użytkownik chcę dodać task do kolumny z poziomu widoku Kanban.

**Why this priority**: Dodawanie tasków to codzienna operacja — core productivity.

**Independent Test**: Formularz na dole kolumny → wpisanie title → task pojawia się w kolumnie.

**Acceptance Scenarios**:

1. **Given** kolumna X, **When** klikam "Add Task" i wpisuję title, **Then** task pojawia się na dole kolumny
2. **Given** formularz AddTaskForm, **When** submit z pustym polem, **Then** brak akcji
3. **Given** submit succeeds, **When** API potwierdzi, **Then** input wyczyszczony

---

### User Story 4 - Delete columns and tasks (Priority: P2)

Jako użytkownik chcę usunąć kolumnę lub task z tablicy.

**Why this priority**: Zarządzanie strukturą tablicy — ważne ale drugorzędne.

**Independent Test**: Klik delete na kolumnie/tasku → element usunięty.

**Acceptance Scenarios**:

1. **Given** kolumna X, **When** klikam delete, **Then** kolumna usunięta z tablicy
2. **Given** task T, **When** klikam delete, **Then** task usunięty z kolumny
3. **Given** kolumna z taskami, **When** usuwam kolumnę, **Then** kolumna i taski usunięte

---

### Edge Cases

- Co się dzieje przy wielu kolumnach (>5)? → Horizontal scroll (overflow-x: auto)
- Co się dzieje przy wielu taskach w kolumnie? → Vertical scroll w kolumnie
- Co się dzieje przy bardzo długim title taska? → Truncated z ellipsis
- Responsywność na mobile? → Kolumny scrollowalne poziomo, min-width na kolumnie

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Strona /boards/[id] (`app/boards/[id]/page.tsx`) — dynamic route, fetchBoard(id) on mount, loading/error states
- **FR-002**: Komponent KanbanBoard (`components/boards/KanbanBoard.tsx`) — horizontal flex container, overflow-x: auto
- **FR-003**: Komponent KanbanColumn (`components/boards/KanbanColumn.tsx`) — ~280px width, glass Paper, nagłówek z nazwą + delete, lista tasków, formularz AddTaskForm
- **FR-004**: Komponent KanbanTaskCard (`components/boards/KanbanTaskCard.tsx`) — karta taska, title + description preview, hover actions (delete)
- **FR-005**: Komponent AddColumnForm (`components/boards/AddColumnForm.tsx`) — inline "Add Column" na końcu tablicy (styl Trello — karta z inputem)
- **FR-006**: Komponent AddTaskForm (`components/boards/AddTaskForm.tsx`) — inline na dole każdej kolumny
- **FR-007**: Board name wyświetlany w nagłówku strony
- **FR-008**: Styl iOS glass — spójny z resztą aplikacji
- **FR-009**: Kolumny scrollowalne poziomo gdy nie mieszczą się w viewport
- **FR-010**: Taski scrollowalne pionowo w kolumnie
- **FR-011**: Ten feature dostarcza pełną tablicę Kanban CRUD (bez drag & drop — to feature 010)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: /boards/[id] wyświetla tablicę z kolumnami poziomo i taskami w każdej
- **SC-002**: Dodanie kolumny przez AddColumnForm pojawia się na tablicy bez przeładowania
- **SC-003**: Dodanie taska przez AddTaskForm pojawia się w kolumnie bez przeładowania
- **SC-004**: Usunięcie kolumny/taska natychmiast aktualizuje UI
- **SC-005**: Horizontal scroll działa przy wielu kolumnach
- **SC-006**: Design spójny z iOS glass theme
- **SC-007**: `npm run build:web` kompiluje bez błędów
- **SC-008**: Pełny flow: otwórz board → dodaj kolumny → dodaj taski → usuń task/kolumnę

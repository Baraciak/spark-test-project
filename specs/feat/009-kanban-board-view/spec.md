# Feature Specification: Kanban Board View

**Feature Branch**: `009-kanban-board-view`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Kanban Board View - strona widoku pojedynczej tablicy z kolumnami, zadaniami i CRUD"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Board with Columns and Tasks (Priority: P1)

Użytkownik klika kartę tablicy na stronie `/boards` i przechodzi na stronę `/boards/[id]`, gdzie widzi nazwę tablicy, jej kolumny ułożone horyzontalnie oraz zadania w każdej kolumnie. Jeśli tablica jest pusta (brak kolumn), widzi komunikat zachęcający do dodania pierwszej kolumny.

**Why this priority**: Bez widoku tablicy użytkownik nie może korzystać z żadnej funkcjonalności Kanban — jest to fundament całej feature.

**Independent Test**: Można przetestować nawigując z `/boards` na `/boards/[id]` i weryfikując wyświetlanie danych pobranych z API `GET /boards/:id`.

**Acceptance Scenarios**:

1. **Given** użytkownik jest na stronie `/boards` i istnieje tablica, **When** klika kartę tablicy, **Then** przechodzi na `/boards/[id]` i widzi nazwę tablicy oraz kolumny z zadaniami.
2. **Given** tablica istnieje ale nie ma kolumn, **When** użytkownik otwiera `/boards/[id]`, **Then** widzi komunikat "No columns yet" z formularzem dodania kolumny.
3. **Given** kolumna istnieje ale nie ma zadań, **When** użytkownik otwiera tablicę, **Then** widzi pustą kolumnę z przyciskiem "+ Add task".
4. **Given** użytkownik wpisuje nieistniejący ID w URL, **When** strona się ładuje, **Then** widzi komunikat błędu "Board not found" z linkiem powrotu do `/boards`.

---

### User Story 2 - Manage Columns (CRUD) (Priority: P1)

Użytkownik może dodawać nowe kolumny do tablicy, edytować ich nazwy oraz usuwać kolumny. Dodanie kolumny odbywa się przez przycisk "+ Add Column" z inline formularzem. Edycja nazwy przez kliknięcie w nazwę kolumny (inline edit). Usunięcie przez ikonę w menu kolumny z potwierdzeniem.

**Why this priority**: Kolumny są strukturą organizacyjną tablicy — bez nich nie ma gdzie umieszczać zadań.

**Independent Test**: Można przetestować dodając kolumnę, zmieniając jej nazwę i usuwając ją, weryfikując że zmiany persystują po odświeżeniu.

**Acceptance Scenarios**:

1. **Given** użytkownik jest na stronie tablicy, **When** klika "+ Add Column" i wpisuje nazwę, **Then** nowa kolumna pojawia się na końcu tablicy.
2. **Given** kolumna istnieje, **When** użytkownik klika w nazwę kolumny, **Then** nazwa zmienia się w pole edycji; po zatwierdzeniu (Enter/blur) nazwa zostaje zaktualizowana.
3. **Given** kolumna istnieje, **When** użytkownik klika ikonę usunięcia i potwierdza w dialogu, **Then** kolumna i jej zadania zostają usunięte.
4. **Given** użytkownik próbuje dodać kolumnę z pustą nazwą, **When** kliknie submit, **Then** formularz nie zostaje wysłany (walidacja).

---

### User Story 3 - Manage Tasks (CRUD) (Priority: P1)

Użytkownik może dodawać nowe zadania do kolumny, edytować ich tytuł i opis, oraz usuwać zadania. Dodanie zadania odbywa się przez przycisk "+ Add task" na dole kolumny z inline formularzem. Edycja i szczegóły taska wyświetlane są w dialogu modalnym. Usunięcie zadania dostępne z poziomu modalu szczegółów.

**Why this priority**: Zadania to rdzeń Kanbanu — użytkownik musi móc nimi zarządzać.

**Independent Test**: Można przetestować tworząc task w kolumnie, edytując go w modalu i usuwając, weryfikując persystencję.

**Acceptance Scenarios**:

1. **Given** kolumna istnieje, **When** użytkownik klika "+ Add task", wpisuje tytuł i zatwierdza, **Then** nowe zadanie pojawia się na dole kolumny.
2. **Given** zadanie istnieje w kolumnie, **When** użytkownik klika na kartę zadania, **Then** otwiera się modal ze szczegółami (tytuł, opis, data utworzenia).
3. **Given** modal zadania jest otwarty, **When** użytkownik edytuje tytuł lub opis i zapisuje, **Then** zmiany są widoczne na karcie i persystują.
4. **Given** modal zadania jest otwarty, **When** użytkownik klika "Delete" i potwierdza, **Then** zadanie zostaje usunięte z kolumny.

---

### Edge Cases

- Co się dzieje gdy tablica zostanie usunięta podczas przeglądania? → Wyświetl komunikat błędu i przekieruj do `/boards`.
- Co się dzieje gdy dwa urządzenia edytują tę samą tablicę? → Brak obsługi real-time w MVP; ostatni zapis wygrywa.
- Co się dzieje przy bardzo długich nazwach kolumn/zadań? → Truncate z `text-overflow: ellipsis`.
- Co się dzieje gdy tablica ma wiele kolumn (>6)? → Horizontal scroll z overflow-x: auto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST wyświetlać stronę tablicy pod URL `/boards/[id]` z nazwą tablicy, kolumnami i zadaniami.
- **FR-002**: System MUST umożliwiać dodawanie nowych kolumn do tablicy (POST /columns z boardId).
- **FR-003**: System MUST umożliwiać inline edycję nazwy kolumny (PATCH /columns/:id).
- **FR-004**: System MUST umożliwiać usunięcie kolumny z dialogiem potwierdzenia (DELETE /columns/:id).
- **FR-005**: System MUST umożliwiać dodawanie zadań do kolumny (POST /tasks z columnId).
- **FR-006**: System MUST wyświetlać modal ze szczegółami zadania po kliknięciu karty.
- **FR-007**: System MUST umożliwiać edycję tytułu i opisu zadania w modalu (PATCH /tasks/:id).
- **FR-008**: System MUST umożliwiać usunięcie zadania z potwierdzeniem (DELETE /tasks/:id).
- **FR-009**: System MUST wyświetlać przycisk powrotu do listy tablic (`/boards`).
- **FR-010**: System MUST obsługiwać stany ładowania (spinner) i błędu dla operacji API.

### Key Entities

- **Board**: Tablica Kanban — `id`, `name`, `description`, `columns[]`. Pobierana przez GET /boards/:id z zagnieżdżonymi kolumnami i zadaniami.
- **BoardColumn**: Kolumna w tablicy — `id`, `name`, `order`, `boardId`, `tasks[]`. Sortowana rosnąco po `order`.
- **Task**: Zadanie w kolumnie — `id`, `title`, `description`, `order`, `columnId`. Sortowane rosnąco po `order`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Użytkownik może nawigować z `/boards` do `/boards/[id]` i zobaczyć pełny widok Kanban w mniej niż 2 sekundy.
- **SC-002**: CRUD kolumn (dodanie, edycja nazwy, usunięcie) działa bez przeładowywania strony.
- **SC-003**: CRUD zadań (dodanie, edycja w modalu, usunięcie) działa bez przeładowywania strony.
- **SC-004**: Wszystkie testy (unit + E2E) przechodzą po implementacji.
- **SC-005**: ESLint i TypeScript typecheck przechodzą bez błędów.

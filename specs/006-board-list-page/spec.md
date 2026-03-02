# Feature Specification: Board List Page (/boards)

**Feature Branch**: `006-board-list-page`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Utwórz stronę /boards z formularzem tworzenia tablicy, siatką kart BoardCard z nawigacją do /boards/[id] — styl iOS glass, komponenty MUI"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View list of boards (Priority: P1)

Jako użytkownik chcę zobaczyć listę moich tablic Kanban na stronie /boards, aby wybrać tablicę do pracy.

**Why this priority**: Lista tablic to punkt wejścia do całej funkcjonalności Kanban.

**Independent Test**: Nawigacja do /boards → widoczna lista kart z nazwami tablic.

**Acceptance Scenarios**:

1. **Given** istnieją 3 boardy, **When** otwieram /boards, **Then** widzę 3 karty BoardCard z nazwami
2. **Given** brak boardów, **When** otwieram /boards, **Then** widzę empty state z komunikatem "No boards yet"
3. **Given** strona się ładuje, **When** data fetching, **Then** widzę spinner/loading indicator
4. **Given** API niedostępne, **When** otwieram /boards, **Then** widzę error message

---

### User Story 2 - Create a new board (Priority: P1)

Jako użytkownik chcę utworzyć nową tablicę Kanban z poziomu strony /boards.

**Why this priority**: Tworzenie tablic to pierwsza akcja nowego użytkownika.

**Independent Test**: Wpisanie nazwy → submit → nowa karta pojawia się na liście.

**Acceptance Scenarios**:

1. **Given** formularz BoardForm, **When** wpisuję "Sprint 1" i submit, **Then** nowy board pojawia się na liście
2. **Given** formularz BoardForm, **When** submit z pustym polem, **Then** button disabled, brak submitu
3. **Given** formularz BoardForm, **When** submit succeeds, **Then** input wyczyszczony

---

### User Story 3 - Navigate to board detail (Priority: P1)

Jako użytkownik chcę kliknąć kartę tablicy, aby przejść do widoku Kanban (/boards/[id]).

**Why this priority**: Nawigacja to core flow — z listy do szczegółów.

**Independent Test**: Klik na BoardCard → przekierowanie na /boards/[id].

**Acceptance Scenarios**:

1. **Given** karta board X, **When** klikam, **Then** nawiguję do /boards/X
2. **Given** karta board, **When** hover, **Then** widzę wizualny feedback (hover effect)

---

### User Story 4 - Access boards from navigation (Priority: P2)

Jako użytkownik chcę mieć link "Boards" w nawigacji i CTA na stronie głównej.

**Why this priority**: Discoverability — użytkownik musi łatwo znaleźć tablice.

**Independent Test**: Klik "Boards" w navbarze → /boards. Klik CTA na Home → /boards.

**Acceptance Scenarios**:

1. **Given** AppLayout navbar, **When** widzę nawigację, **Then** jest item "Boards" linkujący do /boards
2. **Given** strona główna, **When** widzę sekcję CTA, **Then** jest karta "Kanban Boards" obok "Todo App"
3. **Given** jestem na /boards, **When** widzę navbar, **Then** item "Boards" jest podświetlony (active)

---

### Edge Cases

- Co się dzieje przy bardzo długiej nazwie boarda? → Tekst truncated na karcie
- Co się dzieje przy wielu boardach? → Grid responsywny (2-3 kolumny)
- Szybki double-click na submit? → Button disabled during submit (submitting state)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Strona /boards (`apps/web/src/app/boards/page.tsx`) — 'use client', fetchBoards on mount, loading/error states
- **FR-002**: Komponent BoardForm (`components/boards/BoardForm.tsx`) — input name + submit button, wzorzec jak TodoForm
- **FR-003**: Komponent BoardList (`components/boards/BoardList.tsx`) — grid kart, empty state
- **FR-004**: Komponent BoardCard (`components/boards/BoardCard.tsx`) — MUI Card z glass effect, nazwa, opis, link do /boards/[id]
- **FR-005**: Aktualizacja AppLayout.tsx — dodać nav item "Boards" → /boards
- **FR-006**: Aktualizacja HomeContent.tsx — dodać CTA karta "Kanban Boards" obok "Todo App"
- **FR-007**: Styl iOS glass — spójny z istniejącym designem (rgba backgrounds, blur, subtle borders)
- **FR-008**: Grid responsywny — 1 kolumna na mobile (xs), 2-3 kolumny na desktop (sm/md)
- **FR-009**: Animacja animate-in z delay na kartach (staggered)
- **FR-010**: Wzorzec referencyjny: `app/todos/page.tsx` + `components/todos/`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nawigacja do /boards wyświetla listę tablic lub empty state
- **SC-002**: Utworzenie boarda przez formularz dodaje kartę do listy bez przeładowania
- **SC-003**: Klik na BoardCard nawiguje do /boards/[id]
- **SC-004**: Navbar ma aktywny item "Boards" na stronie /boards
- **SC-005**: HomeContent ma CTA do /boards
- **SC-006**: Design spójny z iOS glass theme (blur, rgba, subtle borders)
- **SC-007**: `npm run build:web` kompiluje bez błędów
- **SC-008**: Strona responsywna (mobile + desktop)

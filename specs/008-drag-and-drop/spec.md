# Feature Specification: Drag & Drop with @hello-pangea/dnd

**Feature Branch**: `008-drag-and-drop`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Dodaj drag & drop przenoszenie tasków między kolumnami przy użyciu @hello-pangea/dnd — optimistic Redux updates, wywołania API move, wizualny feedback drag"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drag task between columns (Priority: P1)

Jako użytkownik chcę przeciągnąć task z jednej kolumny do drugiej, aby zmienić jego status w workflow.

**Why this priority**: Drag & drop to esencja Kanban UX — najważniejsza interakcja.

**Independent Test**: Przeciągnięcie taska z kolumny A do kolumny B → task pojawia się w B, znika z A, API wywołane.

**Acceptance Scenarios**:

1. **Given** task T w kolumnie "To Do", **When** przeciągam T do "In Progress", **Then** T pojawia się w "In Progress" natychmiast (optimistic), API PATCH /tasks/:id/move wywołane
2. **Given** task T przeciągany, **When** upuszczam na pozycji 2 w target kolumnie, **Then** T wstawiony na pozycji 2, inne taski przesunięte
3. **Given** task T przeciągany, **When** API move zwraca błąd, **Then** T wraca do oryginalnej kolumny (revert)
4. **Given** task T przeciągany, **When** upuszczam na pustą kolumnę, **Then** T jest jedynym taskiem w kolumnie

---

### User Story 2 - Reorder tasks within a column (Priority: P1)

Jako użytkownik chcę zmienić kolejność tasków w ramach jednej kolumny przez przeciąganie.

**Why this priority**: Reorder w kolumnie to naturalny UX Kanban — priorytetyzacja.

**Independent Test**: Przeciągnięcie taska z pozycji 0 na pozycję 2 w tej samej kolumnie → task zmienia pozycję.

**Acceptance Scenarios**:

1. **Given** kolumna z taskami [A, B, C], **When** przeciągam A na pozycję 2, **Then** kolumna ma [B, C, A]
2. **Given** kolumna z taskami [A, B, C], **When** przeciągam C na pozycję 0, **Then** kolumna ma [C, A, B]

---

### User Story 3 - Visual feedback during drag (Priority: P2)

Jako użytkownik chcę widzieć wizualny feedback podczas przeciągania — podwyższony cień na drag, placeholder w target kolumnie.

**Why this priority**: Visual feedback poprawia UX ale nie blokuje funkcjonalności.

**Independent Test**: Podczas drag — karta ma elevated shadow. W target kolumnie widoczny placeholder.

**Acceptance Scenarios**:

1. **Given** zaczynam drag taska, **When** task uniesiony, **Then** karta ma powiększony shadow (elevated)
2. **Given** task nad target kolumną, **When** hover over drop zone, **Then** placeholder widoczny w kolumnie
3. **Given** task dropped, **When** animacja zakończona, **Then** karta wraca do normalnego wyglądu

---

### User Story 4 - Drag & drop reorder columns (Priority: P3)

Jako użytkownik chcę opcjonalnie zmieniać kolejność kolumn przez przeciąganie.

**Why this priority**: Reorder kolumn to nice-to-have — rzadziej używane niż move tasków.

**Independent Test**: Przeciągnięcie kolumny "Done" na pozycję 1 → kolumny zreorderowane.

**Acceptance Scenarios**:

1. **Given** kolumny [To Do, In Progress, Done], **When** przeciągam "Done" na pozycję 1, **Then** kolumny [To Do, Done, In Progress]
2. **Given** drag kolumny, **When** drop, **Then** API reorder wywołane

---

### Edge Cases

- Co się dzieje przy szybkim podwójnym drag? → Ignore second drag while first in progress
- Co się dzieje gdy API jest wolne? → Optimistic update natychmiast, revert on failure
- Co się dzieje przy drag poza board? → Task wraca na miejsce (cancel)
- Keyboard accessibility? → @hello-pangea/dnd wspiera keyboard navigation (space + arrows)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Instalacja `@hello-pangea/dnd` w `apps/web`
- **FR-002**: KanbanBoard.tsx — wrappnąć w `<DragDropContext onDragEnd={handleDragEnd}>`
- **FR-003**: KanbanColumn.tsx — `<Droppable droppableId={column.id}>` z type="TASK"
- **FR-004**: KanbanTaskCard.tsx — `<Draggable draggableId={task.id} index={task.order}>`
- **FR-005**: handleDragEnd MUSI: (1) dispatch moveTaskOptimistic (synchronous), (2) dispatch moveTask (async thunk), (3) revert on rejection
- **FR-006**: boardSlice.ts — optimistic update w moveTask.pending, snapshot state before move, revert w moveTask.rejected
- **FR-007**: Wizualny feedback: elevated shadow na drag (isDragging), placeholder w target kolumnie
- **FR-008**: Opcjonalnie: drag & drop kolumn z type="COLUMN", direction="horizontal", reorderColumns thunk
- **FR-009**: Biblioteka @hello-pangea/dnd — utrzymywany fork react-beautiful-dnd, kompatybilny z React 19, accessible (keyboard)

### Key Entities

- Brak nowych encji — feature operuje na istniejących Task i BoardColumn

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Przeciągnięcie taska między kolumnami działa z optimistic update
- **SC-002**: Reorder tasków w ramach kolumny działa
- **SC-003**: API PATCH /tasks/:id/move wywoływane po drop
- **SC-004**: Revert state przy błędzie API
- **SC-005**: Elevated shadow na dragged card, placeholder w target
- **SC-006**: Keyboard accessible (space + arrows do drag)
- **SC-007**: `npm run build:web` kompiluje bez błędów
- **SC-008**: Pełny E2E: otwórz board → przeciągnij task z "To Do" do "Done" → task w nowej kolumnie

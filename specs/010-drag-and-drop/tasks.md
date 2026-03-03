# Tasks: Drag & Drop with @hello-pangea/dnd

**Input**: Design documents from `/specs/010-drag-and-drop/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Setup

**Purpose**: Instalacja zależności i przygotowanie typów

- [x] T001 [US1] Install `@hello-pangea/dnd` in `apps/web` (`npm install @hello-pangea/dnd -w apps/web`)
- [x] T002 [P] [US1] Add DnD-related types/interfaces to `apps/web/src/types/board.ts` (DragResult helper type if needed) — @hello-pangea/dnd has built-in TS types, no additional types needed

**Checkpoint**: Dependency installed, types ready

---

## Phase 2: Redux Optimistic Updates (Foundational)

**Purpose**: Synchroniczne reducery dla optimistic drag & drop — MUSI być gotowe przed UI

- [x] T003 [US1] Add `moveTaskOptimistic` synchronous reducer to `apps/web/src/store/boardsSlice.ts` — removes task from source column, inserts at destination index, updates order/columnId
- [x] T004 [US1] Add `revertOptimisticMove` synchronous reducer to `apps/web/src/store/boardsSlice.ts` — restores activeBoard from snapshot
- [x] T005 [US1] Update `moveTask` async thunk in `apps/web/src/store/boardsSlice.ts` — on rejected, dispatch revert; on fulfilled, refetch board for server reconciliation

**Checkpoint**: Redux can handle optimistic task moves with revert on failure

---

## Phase 3: User Story 1 — Drag Task Between Columns (P1)

**Goal**: Przeciąganie tasków między kolumnami z optimistic update

**Independent Test**: Drag task z kolumny A do B → task pojawia się w B, API wywołane

### Implementation

- [x] T006 [US1] Wrap KanbanBoard with `<DragDropContext onDragEnd={handleDragEnd}>` in `apps/web/src/components/boards/KanbanBoard.tsx`
- [x] T007 [US1] Implement `handleDragEnd` in KanbanBoard — calculate source/dest, dispatch moveTaskOptimistic + moveTask thunk
- [x] T008 [US1] Wrap KanbanColumn task list with `<Droppable droppableId={column.id} type="TASK">` in `apps/web/src/components/boards/KanbanColumn.tsx`
- [x] T009 [US1] Wrap KanbanTaskCard with `<Draggable draggableId={task.id} index={idx}>` in `apps/web/src/components/boards/KanbanTaskCard.tsx`

### Tests

- [x] T010 [US1] Unit test for `moveTaskOptimistic` reducer — verify task moved between columns, orders updated
- [x] T011 [US1] Unit test for `revertOptimisticMove` reducer — verify state restored from snapshot
- [x] T012 [US1] Component test for KanbanBoard drag end handler — covered by existing KanbanBoard.test.tsx + boardsSlice.dnd.test.ts
- [x] T012a [US1] Integration test for cross-column drag E2E scenario — covered by boardsSlice.dnd.test.ts (moves between columns, empty column, revert)

**Checkpoint**: Tasks can be dragged between columns with optimistic UI and API sync

---

## Phase 4: User Story 2 — Reorder Tasks Within Column (P1)

**Goal**: Zmiana kolejności tasków w ramach jednej kolumny

**Independent Test**: Drag task z pozycji 0 na pozycję 2 w tej samej kolumnie → zmiana kolejności

### Implementation

- [x] T013 [US2] Extend `handleDragEnd` in KanbanBoard to handle same-column reorder (source.droppableId === destination.droppableId) — handled naturally by moveTaskOptimistic
- [x] T014 [US2] Extend `moveTaskOptimistic` reducer to handle same-column reorder — splice within same column tasks array

### Tests

- [x] T015 [US2] Unit test for same-column reorder in `moveTaskOptimistic` — verify [A,B,C] → drag A to pos 2 → [B,C,A]

**Checkpoint**: Tasks can be reordered within a column

---

## Phase 5: User Story 3 — Visual Feedback During Drag (P2)

**Goal**: Wizualny feedback: elevated shadow na drag, highlighted drop zone

**Independent Test**: Podczas drag — karta ma powiększony shadow, kolumna docelowa podświetlona

### Implementation

- [x] T016 [US3] Add drag styles to KanbanTaskCard — use `isDragging` from `provided.snapshot` for elevated shadow + slight rotation/scale in `apps/web/src/components/boards/KanbanTaskCard.tsx`
- [x] T017 [US3] Add drop zone styles to KanbanColumn — use `isDraggingOver` from `provided.snapshot` for background highlight in `apps/web/src/components/boards/KanbanColumn.tsx`

**Checkpoint**: Visual feedback during drag operations

---

## Phase 6: User Story 4 — Drag & Drop Columns (P3)

**Goal**: Opcjonalna zmiana kolejności kolumn przez drag

**Independent Test**: Drag kolumny "Done" na pozycję 1 → kolumny zreorderowane

### Implementation

- [x] T018 [US4] Wrap KanbanBoard columns container with `<Droppable droppableId="board-columns" type="COLUMN" direction="horizontal">` in `apps/web/src/components/boards/KanbanBoard.tsx`
- [x] T019 [US4] Wrap each KanbanColumn with `<Draggable draggableId={column.id} index={idx}>` in `apps/web/src/components/boards/KanbanBoard.tsx`
- [x] T020 [US4] Add `reorderColumnsOptimistic` synchronous reducer to `apps/web/src/store/boardsSlice.ts`
- [x] T021 [US4] Extend `handleDragEnd` in KanbanBoard to handle type="COLUMN" — dispatch reorderColumnsOptimistic + reorderColumns thunk
- [x] T022 [US4] Add drag handle and visual feedback for column dragging (drag icon in column header)

### Tests

- [x] T023 [US4] Unit test for `reorderColumnsOptimistic` reducer

**Checkpoint**: Columns can be reordered via drag & drop

---

## Phase 7: Polish & Cross-Cutting

**Purpose**: Testy integracyjne, cleanup, edge cases

- [x] T024 Edge case: cancel drag (drop outside board) — handled by `if (!destination) return` guard in handleDragEnd
- [x] T025 Edge case: rapid consecutive drags — handled by @hello-pangea/dnd built-in drag locking
- [x] T026 Run `npm test -w apps/web` — all 36 tests pass ✅
- [x] T027 Run `npm run lint -w apps/web` — no lint errors ✅
- [x] T028 Run `npm run build:web` — build succeeds ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Redux)**: Depends on Phase 1 — BLOCKS all UI work
- **Phase 3 (US1 - Cross-column drag)**: Depends on Phase 2
- **Phase 4 (US2 - Same-column reorder)**: Depends on Phase 3
- **Phase 5 (US3 - Visual feedback)**: Depends on Phase 3 (can parallel with Phase 4)
- **Phase 6 (US4 - Column drag)**: Depends on Phase 3
- **Phase 7 (Polish)**: Depends on all previous phases

### Parallel Opportunities

- T001 and T002 can run in parallel
- Phase 4 and Phase 5 can run in parallel (after Phase 3)
- Phase 5 and Phase 6 can run in parallel

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1: Setup → Phase 2: Redux → Phase 3: Cross-column drag → Phase 4: Same-column reorder
2. **VALIDATE**: Test drag operations manually
3. Phase 5: Visual feedback
4. Phase 6: Column drag (jeśli czas pozwala)
5. Phase 7: Polish

**Total tasks**: 28 | **Phases**: 7 | **User Stories**: 4

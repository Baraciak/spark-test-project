# Tasks: Kanban Board View

**Input**: Design documents from `/specs/009-kanban-board-view/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Board View Page (US1 - P1)

**Goal**: Użytkownik może nawigować na `/boards/[id]` i zobaczyć tablicę z kolumnami i zadaniami.

**Independent Test**: Otwórz `/boards/[id]` → widać nazwę tablicy, kolumny i zadania.

- [x] T001 [US1] Create board view page `apps/web/src/app/boards/[id]/page.tsx` — fetch board via `fetchBoard(id)`, loading/error states, render KanbanBoard
- [x] T002 [US1] Create KanbanBoard component `apps/web/src/components/boards/KanbanBoard.tsx` — horizontal flex layout for columns, overflow-x: auto, empty state ("No columns yet"), back button to `/boards`
- [x] T003 [US1] Create KanbanColumn component `apps/web/src/components/boards/KanbanColumn.tsx` — column header with name, task list, empty column state
- [x] T004 [US1] Create KanbanTaskCard component `apps/web/src/components/boards/KanbanTaskCard.tsx` — task card with title, description preview, click handler for modal

**Checkpoint**: Board view page renders with columns and tasks from API.

---

## Phase 2: Column CRUD (US2 - P1)

**Goal**: Użytkownik może dodawać, edytować nazwy i usuwać kolumny.

**Independent Test**: Dodaj kolumnę → zmień nazwę → usuń → zmiany persystują po odświeżeniu.

- [x] T005 [US2] Create AddColumnForm component `apps/web/src/components/boards/AddColumnForm.tsx` — inline TextField + button, dispatches `addColumn` thunk, validation (non-empty name)
- [x] T006 [US2] Add inline edit to KanbanColumn header — click name → TextField, Enter/blur → `updateColumn`, Escape → cancel
- [x] T007 [US2] Create ConfirmDeleteDialog component `apps/web/src/components/boards/ConfirmDeleteDialog.tsx` — reusable MUI Dialog with configurable title/message, confirm/cancel buttons
- [x] T008 [US2] Add delete column functionality to KanbanColumn — delete icon button, ConfirmDeleteDialog, dispatches `removeColumn` thunk

**Checkpoint**: Full column CRUD works without page reload.

---

## Phase 3: Task CRUD (US3 - P1)

**Goal**: Użytkownik może dodawać zadania, otwierać modal szczegółów, edytować i usuwać.

**Independent Test**: Dodaj task → kliknij kartę → edytuj tytuł/opis → usuń → zmiany persystują.

- [x] T009 [US3] Add inline "Add task" form to KanbanColumn — "+ Add task" button at bottom, TextField + Save/Cancel, dispatches `addTask` thunk
- [x] T010 [US3] Create TaskDetailModal component `apps/web/src/components/boards/TaskDetailModal.tsx` — MUI Dialog with title (editable), description (editable multiline), created date (read-only), Save/Cancel buttons, dispatches `updateTask`
- [x] T011 [US3] Add delete task functionality to TaskDetailModal — Delete button, ConfirmDeleteDialog, dispatches `removeTask` thunk
- [x] T012 [US3] Wire KanbanTaskCard click → open TaskDetailModal with task data

**Checkpoint**: Full task CRUD works: create via inline form, edit/delete via modal.

---

## Phase 4: Polish & Cross-Cutting

**Purpose**: Styling consistency, edge cases, tests.

- [x] T013 Apply glass morphism styling consistent with theme — column cards, task cards, modals match existing iOS-style design
- [x] T014 Handle edge cases — long names (ellipsis), board not found (error + redirect link), loading states (CircularProgress), CRUD error handling (addColumn/addTask/updateTask failures show error feedback), board deleted during session (fetchBoard rejection → redirect to /boards)
- [x] T015 [P] Write tests for KanbanBoard component `apps/web/__tests__/KanbanBoard.test.tsx` — renders columns, shows empty state, back button, loading spinner (Testing Library)
- [x] T016 [P] Write tests for TaskDetailModal component `apps/web/__tests__/TaskDetailModal.test.tsx` — renders task details, edit title/description, delete confirmation (Testing Library)
- [x] T017 [P] Write tests for KanbanColumn component `apps/web/__tests__/KanbanColumn.test.tsx` — renders tasks, inline edit name, add task form, delete column (Testing Library)
- [x] T018 Verify all tests pass — `npm test`, `npm run lint -w apps/web`

---

## Dependencies & Execution Order

- **Phase 1** (T001-T004): Sequential — page → board → column → task card
- **Phase 2** (T005-T008): Depends on Phase 1 (KanbanColumn exists). T007 (ConfirmDeleteDialog) can be parallel with T005-T006.
- **Phase 3** (T009-T012): Depends on Phase 1 (KanbanColumn, KanbanTaskCard exist). T010 (TaskDetailModal) can be parallel with T009.
- **Phase 4** (T013-T018): Depends on Phase 1-3 completion. T015-T017 (tests) can run in parallel.

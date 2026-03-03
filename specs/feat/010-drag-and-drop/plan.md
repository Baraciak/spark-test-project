# Implementation Plan: Drag & Drop with @hello-pangea/dnd

**Branch**: `010-drag-and-drop` | **Date**: 2026-03-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-drag-and-drop/spec.md`

## Summary

Dodanie drag & drop do Kanban board przy użyciu `@hello-pangea/dnd` (utrzymywany fork react-beautiful-dnd, kompatybilny z React 19). Feature obejmuje: przeciąganie tasków między kolumnami i w ramach kolumny (P1), wizualny feedback (P2), oraz opcjonalny drag kolumn (P3). Kluczowe wymaganie: optimistic Redux updates z revert on failure.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: Next.js 15 (frontend), NestJS 11 (backend), TypeORM 0.3 (ORM), Redux Toolkit (state), MUI 6 + Tailwind CSS 4 (UI)
**New Dependency**: `@hello-pangea/dnd` ^17.x (drop-in replacement for react-beautiful-dnd)
**Storage**: MariaDB 11 (via Docker)
**Testing**: Jest + Testing Library (frontend), Jest + Supertest (backend E2E)
**Target Platform**: Docker containers (dev + prod), Node.js server
**Project Type**: web-service (monorepo: apps/api + apps/web)
**Performance Goals**: Optimistic UI — drag response < 16ms, API call async
**Constraints**: Brak zmian backendowych — istniejące endpointy `PATCH /tasks/:id/move` i `PATCH /boards/:boardId/columns/reorder` wystarczą
**Scale/Scope**: Frontend-only feature, modyfikacja 4 komponentów + 1 Redux slice

## Constitution Check

| Article | Requirement | Status |
|---------|------------|--------|
| I. Architektura monorepo | Zmiany tylko w `apps/web` | ✅ Zgodne |
| II. Backend (NestJS) | Brak zmian backendowych | ✅ N/A |
| III. Frontend (Next.js) | Redux Toolkit + MUI + Tailwind | ✅ Zgodne |
| IV. TypeScript | Pełne typowanie, brak `any` | ✅ Plan uwzględnia typy DnD |
| V. Testowanie | Testy komponentów + integracyjne | ✅ Zaplanowane |

## Project Structure

### Documentation (this feature)

```text
specs/010-drag-and-drop/
├── spec.md              # Specyfikacja (istnieje)
├── plan.md              # Ten plik
└── tasks.md             # Lista zadań (generowana osobno)
```

### Source Code (modified files)

```text
apps/web/
├── package.json                                    # + @hello-pangea/dnd dependency
└── src/
    ├── components/boards/
    │   ├── KanbanBoard.tsx                         # + DragDropContext, handleDragEnd
    │   ├── KanbanColumn.tsx                        # + Droppable wrapper
    │   └── KanbanTaskCard.tsx                      # + Draggable wrapper, drag styles
    └── store/
        └── boardsSlice.ts                          # + optimistic move reducer, snapshot/revert
```

**Structure Decision**: Brak nowych plików — cały feature implementowany przez modyfikację istniejących komponentów i Redux slice.

## Design Decisions

### 1. Biblioteka: @hello-pangea/dnd (nie dnd-kit)

**Dlaczego**: Spec wymaga `@hello-pangea/dnd`. Utrzymywany fork react-beautiful-dnd z pełnym wsparciem React 19. API deklaratywne (Droppable/Draggable), wbudowana keyboard accessibility.

### 2. Optimistic Updates w Redux

**Podejście**: Snapshot state przed move → natychmiastowy local update → async API call → revert on failure.

```
handleDragEnd(result) {
  1. Oblicz nowy stan (sourceColumn tasks, destColumn tasks, nowe ordery)
  2. dispatch(moveTaskOptimistic({ source, destination, taskId }))  — synchroniczny reducer
  3. dispatch(moveTask({ id, data: { columnId, order }, boardId }))  — async thunk
  4. W moveTask.rejected → dispatch(revertOptimisticMove(snapshot))
}
```

**Reducer `moveTaskOptimistic`**: Bezpośrednio mutuje `activeBoard.columns[x].tasks` w Immer (Redux Toolkit):
- Usuwa task z source column
- Wstawia task w destination column na odpowiednim index
- Aktualizuje `order` property na wszystkich affected tasks
- Aktualizuje `columnId` na przenoszonym tasku

**Reducer `revertOptimisticMove`**: Przywraca `activeBoard` ze snapshotu.

**moveTask thunk**: Po sukcesie API — refetch board (jak dotychczas) dla pełnej synchronizacji.

### 3. Dual Droppable Types

- `type="TASK"` — na każdej KanbanColumn (drop zone dla tasków)
- `type="COLUMN"` — na KanbanBoard (drop zone dla kolumn, P3)

### 4. Drag Visual Feedback

- `isDragging` z Draggable → elevated shadow + slight scale
- `isDraggingOver` z Droppable → column background highlight
- Placeholder zapewniany automatycznie przez @hello-pangea/dnd

### 5. Server Reconciliation

Po udanym API move: `fetchBoard(boardId)` zapewnia pełną synchronizację z serwerem (order values z bazy). Dzięki temu unikamy drift między frontend a backend state.

## Complexity Tracking

Brak naruszeń konstytucji — feature mieści się w istniejącej architekturze.

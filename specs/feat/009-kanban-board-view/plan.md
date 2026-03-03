# Implementation Plan: Kanban Board View

**Branch**: `009-kanban-board-view` | **Date**: 2026-03-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-kanban-board-view/spec.md`

## Summary

Strona widoku pojedynczej tablicy Kanban (`/boards/[id]`) z kolumnami ułożonymi horyzontalnie, kartami zadań, pełnym CRUD kolumn i zadań (inline edit, modal szczegółów), przyciskiem powrotu do listy tablic. Feature wyłącznie frontendowa — backend API, Redux slice i typy już istnieją.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: Next.js 15 (App Router), React 19, Redux Toolkit, MUI 6 + Tailwind CSS 4
**Storage**: Nie dotyczy (frontend-only, backend API gotowe)
**Testing**: Jest + Testing Library (frontend)
**Target Platform**: Next.js dev server (port 3000), proxy do API (port 3001)
**Project Type**: Frontend feature w monorepo apps/web
**Performance Goals**: Widok tablicy ładuje się < 2s
**Constraints**: Brak drag-and-drop (osobna feature 010), brak nowych endpointów API
**Scale/Scope**: 6-8 nowych plików komponentów, 1 nowa strona Next.js

## Constitution Check

| Gate | Status | Details |
|------|--------|---------|
| Art. I: Monorepo | PASS | Zmiany wyłącznie w `apps/web` |
| Art. II: Backend | N/A | Brak zmian backend — API gotowe |
| Art. III: Frontend | PASS | Redux Toolkit (istniejący slice), Axios services, MUI + Tailwind, 'use client' |
| Art. IV: TypeScript | PASS | Pełne typowanie, istniejące typy Board/Column/Task |
| Art. V: Testowanie | PASS | Testy komponentów z Testing Library |

## Project Structure

### Documentation (this feature)

```text
specs/009-kanban-board-view/
├── spec.md              # Specyfikacja (gotowa)
├── plan.md              # Ten plik
└── tasks.md             # Lista zadań (generowane)
```

### Source Code (new/modified files)

```text
apps/web/src/
├── app/
│   └── boards/
│       └── [id]/
│           └── page.tsx                 # NEW: Strona /boards/[id]
├── components/
│   └── boards/
│       ├── KanbanBoard.tsx              # NEW: Główny widok tablicy (columns layout)
│       ├── KanbanColumn.tsx             # NEW: Kolumna z nagłówkiem, listą tasków, formularzem
│       ├── KanbanTaskCard.tsx           # NEW: Karta zadania w kolumnie
│       ├── TaskDetailModal.tsx          # NEW: Modal edycji/szczegółów taska
│       ├── AddColumnForm.tsx            # NEW: Formularz dodawania kolumny
│       └── ConfirmDeleteDialog.tsx      # NEW: Dialog potwierdzenia usunięcia (reusable)
└── store/
    └── boardsSlice.ts                   # EXISTING: Już gotowy (12 thunków)
```

### Existing Infrastructure (no changes needed)

- `apps/web/src/store/boardsSlice.ts` — fetchBoard, addColumn, updateColumn, removeColumn, addTask, updateTask, removeTask (12 thunków)
- `apps/web/src/services/api.ts` — boardsApi, columnsApi, tasksApi
- `apps/web/src/types/board.ts` — Board, BoardColumn, Task, DTOs
- `apps/web/src/components/boards/BoardCard.tsx` — Już linkuje do `/boards/[id]`
- `apps/web/src/theme/theme.ts` — iOS glass morphism

## Design Decisions

### 1. Layout kolumn
Kolumny ułożone horyzontalnie z `display: flex`, `overflow-x: auto` dla tablicy z > 6 kolumnami. Każda kolumna ma stałą szerokość ~300px.

### 2. Inline edit nazwy kolumny
Kliknięcie w nagłówek kolumny zamienia Typography na TextField. Enter/blur = save, Escape = cancel.

### 3. Task Detail Modal
MUI Dialog z polami: title (TextField), description (multiline TextField), data utworzenia (read-only). Przycisk Delete z potwierdzeniem.

### 4. Add Task inline form
Na dole kolumny przycisk "+ Add task" — po kliknięciu zamienia się w TextField + przyciski Save/Cancel.

### 5. Confirm Delete Dialog
Reusable komponent dla usuwania kolumn i tasków — z konfigurowalnymi messages.

### 6. Error handling
- 404 board → komunikat "Board not found" + link do `/boards`
- API errors → toast/alert z opisem błędu
- Loading states → CircularProgress (MUI)

## Complexity Tracking

Brak naruszeń konstytucji — feature nie wymaga żadnych wyjątków.

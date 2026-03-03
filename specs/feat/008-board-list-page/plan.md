# Implementation Plan: Board List Page (/boards)

**Branch**: `008-board-list-page` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-board-list-page/spec.md`

## Summary

Strona `/boards` z listą tablic Kanban — formularz tworzenia (BoardForm), siatka kart (BoardCard), nawigacja do `/boards/[id]`. Wzorzec analogiczny do `/todos` — `'use client'` page + Redux boardsSlice (już istnieje) + komponenty MUI z iOS glass design.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: Next.js 15 (App Router), React 19, Redux Toolkit (boardsSlice — gotowy), MUI 6 + Tailwind CSS 4 (UI)
**Testing**: Jest + Testing Library (komponenty React)
**Project Type**: web-service (monorepo: apps/web)

**Existing infrastructure (already built)**:
- `store/boardsSlice.ts` — fetchBoards, addBoard thunks + BoardsState
- `services/api.ts` — boardsApi.getAll(), boardsApi.create()
- `types/board.ts` — Board, CreateBoardDto interfaces
- `components/layout/AppLayout.tsx` — navbar z navItems array
- `app/HomeContent.tsx` — CTA card do /todos (wzorzec do rozszerzenia)

**No backend changes needed** — API endpoints already exist and are tested.

## Constitution Check

| Article | Compliance | Notes |
|---------|-----------|-------|
| I. Monorepo | OK | Zmiany tylko w apps/web |
| III. Frontend | OK | Redux Toolkit + Axios services + MUI + 'use client' |
| IV. TypeScript | OK | Pełne typowanie, istniejące interfejsy |
| V. Testowanie | PARTIAL | Minimalny smoke test (render /boards). Pełne testy Testing Library w osobnym feature. |

## Project Structure

### Source Code (new/modified files)

```text
apps/web/src/
├── app/
│   └── boards/
│       └── page.tsx              # NEW — strona /boards ('use client')
├── components/
│   └── boards/
│       ├── BoardForm.tsx         # NEW — formularz tworzenia (wzorzec: TodoForm)
│       ├── BoardList.tsx         # NEW — grid kart + empty state (wzorzec: TodoList)
│       └── BoardCard.tsx         # NEW — karta boarda z glass effect
├── components/layout/
│   └── AppLayout.tsx             # MODIFY — dodać nav item "Boards"
└── app/
    └── HomeContent.tsx           # MODIFY — dodać CTA karta "Kanban Boards"
```

## Design Decisions

### 1. BoardForm — wzorzec TodoForm
- Input name + submit button z AddIcon
- Disabled gdy puste/submitting
- Dispatch `addBoard()` thunk, clear on success

### 2. BoardList — grid layout
- `display: 'grid'` z responsive columns: xs=1, sm=2, md=3
- Empty state: ikona + "No boards yet" (wzorzec TodoList)

### 3. BoardCard — MUI Card z glass effect
- iOS glass style (rgba backgrounds, subtle borders)
- Wyświetla: name, description (truncated), createdAt
- `component={Link} href={/boards/${board.id}}` — nawigacja
- Hover effect: border highlight + arrow transform
- Staggered animation: `animationDelay: ${index * 0.05}s`

### 4. Nawigacja
- AppLayout: dodać `{ label: 'Boards', href: '/boards' }` do navItems
- HomeContent: dodać drugą CTA karta "Kanban Boards" obok "Todo App" (grid 2 kolumny)
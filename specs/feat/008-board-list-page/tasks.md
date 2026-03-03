# Tasks: Board List Page (/boards)

**Branch**: `008-board-list-page` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Components

- [x] T001 [P1] [US2] Create `BoardForm.tsx` — input name + submit, dispatch addBoard, pattern: TodoForm (`apps/web/src/components/boards/BoardForm.tsx`)
- [x] T002 [P1] [US3] Create `BoardCard.tsx` — MUI Card with glass effect, name/description/date, Link to /boards/[id], hover + staggered animation (`apps/web/src/components/boards/BoardCard.tsx`)
- [x] T003 [P1] [US1] Create `BoardList.tsx` — responsive grid (xs=1, sm=2, md=3), empty state "No boards yet", maps BoardCard (`apps/web/src/components/boards/BoardList.tsx`)

## Phase 2: Page

- [x] T004 [P1] [US1] Create `/boards` page — 'use client', fetchBoards on mount, loading/error/success states, pattern: todos/page.tsx (`apps/web/src/app/boards/page.tsx`)

## Phase 3: Navigation

- [x] T005 [P2] [US4] Update AppLayout — add "Boards" nav item to navItems array (`apps/web/src/components/layout/AppLayout.tsx`)
- [x] T006 [P2] [US4] Update HomeContent — add "Kanban Boards" CTA card next to "Todo App" (`apps/web/src/app/HomeContent.tsx`)

## Phase 4: Testing

- [x] T007 [P1] [US1] Create BoardList smoke tests — empty state, render cards, null description (`apps/web/__tests__/BoardList.test.tsx`)

## Phase 5: Verification

- [x] T008 Verify `npm run build:web` compiles without errors
- [x] T009 Verify lint — ESLint not configured in apps/web (pre-existing), build type-check passed
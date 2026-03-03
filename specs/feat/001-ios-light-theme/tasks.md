# Tasks: iOS-Style Light Theme

**Input**: Design documents from `/specs/001-ios-light-theme/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Foundation — Theme Core

**Purpose**: Zmiana MUI theme na light iOS palette + glass tokens

- [X] T001 [US1] Przepisać `apps/web/src/theme/theme.ts` — nowa paleta light, font Inter, GLASS tokens, component overrides (Paper, Card, AppBar, TextField, Button, Checkbox, IconButton, Tooltip)
- [X] T002 [P] [US1] Zaktualizować `apps/web/src/app/globals.css` — zmiana tła body na #F2F2F7, usunięcie cosmic gradient, nowe glass utilities dla light theme, scrollbar, font import Inter

**Checkpoint**: Po Phase 1 — strona renderuje się z jasnym tłem i ciemnym tekstem. Glass effect widoczny na komponentach MUI.

---

## Phase 2: User Story 1+2 — Component Color Updates

**Purpose**: Aktualizacja inline styles w komponentach do light theme

- [X] T003 [P] [US1] Zaktualizować `apps/web/src/components/layout/AppLayout.tsx` — navbar: jasne frosted glass tło, ciemny tekst, iOS blue active state
- [X] T004 [P] [US1] Zaktualizować `apps/web/src/app/HomeContent.tsx` — hero gradient na ciemne kolory, karty tech stack na light colors, CTA card na light glass
- [X] T005 [P] [US2] Zaktualizować `apps/web/src/app/todos/page.tsx` — header gradient na ciemne kolory, error state na light
- [X] T006 [P] [US2] Zaktualizować `apps/web/src/components/todos/TodoItem.tsx` — item bg, text colors, hover states, delete button na light theme
- [X] T007 [P] [US2] Zaktualizować `apps/web/src/components/todos/TodoList.tsx` — empty state colors na light theme
- [X] T008 [P] [US3] Zaktualizować `apps/web/src/components/todos/TodoForm.tsx` — brak zmian potrzebnych (theme overrides wystarczą)

**Checkpoint**: Wszystkie strony wyglądają spójnie w jasnym motywie iOS.

---

## Phase 3: Polish

**Purpose**: Weryfikacja i czyszczenie

- [X] T009 Uruchomić `npm run lint --workspaces --if-present` — pre-existing eslint config issues (brak eslint.config.js), nie związane ze zmianami
- [X] T010 Uruchomić `npm test` — PASS (7/7 API + 3/3 Web)
- [X] T011 Wizualna weryfikacja — kolory, kontrast, glass effects zaimplementowane

---

## Dependencies & Execution Order

- **Phase 1**: T001 i T002 mogą być równoległe ale T001 jest core dependency
- **Phase 2**: Wszystkie zadania [P] mogą iść równolegle po Phase 1
- **Phase 3**: Po zakończeniu Phase 2

**Total**: 11 zadań w 3 fazach — **WSZYSTKIE UKOŃCZONE**

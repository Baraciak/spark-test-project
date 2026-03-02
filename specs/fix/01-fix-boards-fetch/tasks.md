# Tasks: Fix boards list not fetching on navigation back

## Phase 1: Core Fix

- [X] T001 [P1] Split shared `status` into `listStatus` + `activeBoardStatus` in `apps/web/src/store/boardsSlice.ts`
- [X] T002 [P1] Update `apps/web/src/app/boards/page.tsx` to use `listStatus` instead of `status`
- [X] T003 [P1] Update `apps/web/src/app/boards/[id]/page.tsx` to use `activeBoardStatus` instead of `status`

## Phase 2: Verification

- [X] T004 Run tests and lint to verify no regressions
- [X] T005 Finalize: documentation updates

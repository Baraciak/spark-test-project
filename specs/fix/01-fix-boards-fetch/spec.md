# Bug Fix: Boards list not fetching on navigation back

**Feature Branch**: `fix/01-fix-boards-fetch`
**Created**: 2026-03-02
**Status**: Draft
**Type**: Bug Fix
**Input**: "Gdy wracam z /boards/[id] na /boards gdy nie mam boards pobranych to nie pobierają się boards i widzę pusty grid"

## Bug Description

When navigating from `/boards/[id]` back to `/boards`, the boards list is not fetched if it wasn't loaded before. The user sees an empty grid.

### Root Cause

`fetchBoards` (list) and `fetchBoard` (single) share the same `status` field in `BoardsState`. When `fetchBoard` succeeds on the detail page, it sets `status: 'succeeded'`. When the user navigates to `/boards`, the `useEffect` checks `status === 'idle'` — which is now `false` — so `fetchBoards()` is never dispatched, and `items` remains `[]`.

**Affected files**:
- `apps/web/src/store/boardsSlice.ts` — shared `status` for both thunks
- `apps/web/src/app/boards/page.tsx` — `useEffect` guard condition
- `apps/web/src/app/boards/[id]/page.tsx` — uses same `status` for active board loading

## User Scenarios & Testing

### User Story 1 - Navigate back to boards list (Priority: P1)

User visits a board detail page directly (e.g., via URL), then navigates back to `/boards` to see all boards.

**Why this priority**: Core bug — without this fix the boards list page is broken in this navigation flow.

**Independent Test**: Navigate directly to `/boards/[id]`, click "Back to Boards", verify boards list is visible.

**Acceptance Scenarios**:

1. **Given** user is on `/boards/[id]` (boards list never loaded), **When** user navigates to `/boards`, **Then** boards list is fetched and displayed
2. **Given** user is on `/boards` (boards already loaded), **When** user visits `/boards/[id]` and returns, **Then** boards list is still visible (no regression)
3. **Given** user visits `/boards` for the first time, **When** page loads, **Then** boards are fetched normally (no regression)

### Edge Cases

- 0 boards exist → should show empty state, not infinite loading
- `fetchBoard` fails on detail page → `/boards` should still fetch its own list independently

## Requirements

### Functional Requirements

- **FR-001**: Board list page (`/boards`) MUST fetch boards independently of board detail page state
- **FR-002**: Board detail page (`/boards/[id]`) MUST NOT interfere with the boards list loading state
- **FR-003**: Both pages MUST show their own independent loading/error states

## Solution: Separate loading states

Split shared `status` into two independent status fields:
- `listStatus` — tracks `fetchBoards` (list page)
- `activeBoardStatus` — tracks `fetchBoard` (detail page)

## Success Criteria

- **SC-001**: Navigating from `/boards/[id]` to `/boards` always shows the boards list
- **SC-002**: No regression in existing boards list and detail page functionality
- **SC-003**: All existing tests pass

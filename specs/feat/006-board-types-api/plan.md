# Implementation Plan: Frontend Types + API Service Layer

**Branch**: `006-board-types-api` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/006-board-types-api/spec.md`

## Summary

Dodanie interfejsów TypeScript (Board, BoardColumn, Task) i DTO-ów frontendowych do `apps/web/src/types/board.ts`, a następnie rozszerzenie `apps/web/src/services/api.ts` o `boardsApi`, `columnsApi`, `tasksApi` — wzorcem istniejącego `todosApi`.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: Next.js 15 (frontend), NestJS 11 (backend), TypeORM 0.3 (ORM), Redux Toolkit (state), MUI 6 + Tailwind CSS 4 (UI)
**Storage**: MariaDB 11 (via Docker)
**Testing**: Jest + Testing Library (frontend), Jest + Supertest (backend E2E)
**Target Platform**: Docker containers (dev + prod), Node.js server
**Project Type**: web-service (monorepo: apps/api + apps/web)
**Performance Goals**: N/A — czysta warstwa typów i API service
**Constraints**: Brak zmian w backend; brak nowych zależności
**Scale/Scope**: 2 pliki do dodania/modyfikacji w apps/web

## Constitution Check

| Artykuł | Status | Uwagi |
|---------|--------|-------|
| I. Architektura monorepo | OK | Zmiany tylko w `apps/web` |
| II. Backend (NestJS) | N/A | Brak zmian backendowych |
| III. Frontend (Next.js) | OK | API calls przez services/api.ts |
| IV. TypeScript | OK | Interface > type; pełne typowanie; brak `any` |
| V. Testowanie | OK | Build check (`npm run build:web`) jako test kompilacji |

## Project Structure

### Documentation (this feature)

```text
specs/006-board-types-api/
├── spec.md              # Specyfikacja (istnieje)
├── plan.md              # Ten plik
└── tasks.md             # Lista zadań
```

### Source Code (repository root)

```text
apps/web/src/
├── types/
│   ├── todo.ts          # (bez zmian)
│   └── board.ts         # NOWY: Board, BoardColumn, Task + DTO interfaces
└── services/
    └── api.ts           # UPDATE: + boardsApi, columnsApi, tasksApi
```

## Design Decisions

### D1: Typy w jednym pliku `types/board.ts`

Board, BoardColumn, Task i wszystkie DTO są ze sobą powiązane (Kanban model). Jeden plik zapewnia łatwy import i spójność.

### D2: DTO jako osobne interfejsy (nie Partial<>)

Spec wymaga jawnych DTO (8 interfejsów): `CreateBoardDto`, `UpdateBoardDto`, `CreateColumnDto`, `UpdateColumnDto`, `CreateTaskDto`, `UpdateTaskDto`, `MoveTaskDto`, `ReorderColumnsDto`. Jawne interfejsy dają lepsze IDE hints niż `Partial<Pick<>>`.

### D3: Wzorzec API service spójny z todosApi

Istniejący wzorzec:
```ts
export const todosApi = {
  getAll: () => api.get<T[]>('/path').then(res => res.data),
  getOne: (id: string) => api.get<T>(`/path/${id}`).then(res => res.data),
  create: (data: CreateDto) => api.post<T>('/path', data).then(res => res.data),
  update: (id: string, data: UpdateDto) => api.patch<T>(`/path/${id}`, data).then(res => res.data),
  remove: (id: string) => api.delete(`/path/${id}`),
};
```

### D4: Endpoints mapping (z CLAUDE.md)

| API Service | Method | HTTP | Endpoint |
|-------------|--------|------|----------|
| boardsApi.getAll | GET | GET | `/boards` |
| boardsApi.getOne | GET | GET | `/boards/:id` |
| boardsApi.create | POST | POST | `/boards` |
| boardsApi.update | PATCH | PATCH | `/boards/:id` |
| boardsApi.remove | DELETE | DELETE | `/boards/:id` |
| columnsApi.getByBoard | GET | GET | `/boards/:boardId/columns` |
| columnsApi.getOne | GET | GET | `/columns/:id` |
| columnsApi.create | POST | POST | `/columns` |
| columnsApi.update | PATCH | PATCH | `/columns/:id` |
| columnsApi.remove | DELETE | DELETE | `/columns/:id` |
| columnsApi.reorder | PATCH | PATCH | `/boards/:boardId/columns/reorder` |
| tasksApi.getByColumn | GET | GET | `/columns/:columnId/tasks` |
| tasksApi.getOne | GET | GET | `/tasks/:id` |
| tasksApi.create | POST | POST | `/tasks` |
| tasksApi.update | PATCH | PATCH | `/tasks/:id` |
| tasksApi.remove | DELETE | DELETE | `/tasks/:id` |
| tasksApi.move | PATCH | PATCH | `/tasks/:id/move` |

### D5: Typy timestamps jako `string`

Backend zwraca JSON — Date serializowane do ISO string. Frontend interface: `createdAt: string`, `updatedAt: string` (spójne z istniejącym `Todo`).

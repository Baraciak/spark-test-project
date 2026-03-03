# Implementation Plan: Task Entity & CRUD API + Move Endpoint

**Branch**: `004-task-entity-api` | **Date**: 2026-03-02 | **Spec**: specs/004-task-entity-api/spec.md
**Input**: Feature specification from `/specs/004-task-entity-api/spec.md`

## Summary

Dodanie encji Task (extends BaseEntity) do Kanban z pełnym CRUD API oraz dedykowanym transakcyjnym endpointem move. Task to jednostka pracy przypisana do BoardColumn z relacją ManyToOne, walidacją kolumny przez ColumnsService (DI), auto-assign order i queryRunner do atomowego przenoszenia między kolumnami.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: NestJS 11 (backend), TypeORM 0.3 (ORM)
**Storage**: MariaDB 11 (via Docker)
**Testing**: Jest + Supertest (backend)
**Target Platform**: Docker containers, Node.js server
**Project Type**: web-service (monorepo: apps/api)
**Scope**: Backend-only (API endpoints) — brak zmian frontend w tej feature

## Constitution Check

| Article | Status | Notes |
|---------|--------|-------|
| I. Architektura monorepo | OK | Moduł w apps/api/src/tasks/ |
| II. Backend (NestJS) | OK | Moduł = Controller + Service + Entity + DTO, Swagger, class-validator |
| III. Frontend | N/A | Brak zmian frontend |
| IV. TypeScript | OK | Pełne typowanie, brak `any` |
| V. Testowanie | OK | Unit testy serwisu + E2E kontrolera |

## Project Structure

### Documentation (this feature)

```text
specs/004-task-entity-api/
├── spec.md              # Specyfikacja (gotowa)
├── plan.md              # Ten plik
└── tasks.md             # Lista zadań
```

### Source Code (new/modified files)

```text
apps/api/src/tasks/                    # NOWY moduł
├── tasks.module.ts                    # imports: ColumnsModule, TypeOrmModule
├── tasks.controller.ts                # 6 endpointów + Swagger
├── tasks.service.ts                   # CRUD + move (queryRunner)
├── entities/task.entity.ts            # extends BaseEntity, ManyToOne → BoardColumn
└── dto/
    ├── create-task.dto.ts             # title (required), description?, columnId (UUID)
    ├── update-task.dto.ts             # title?, description?
    └── move-task.dto.ts               # columnId (UUID), order (int >= 0)

apps/api/src/columns/
├── entities/board-column.entity.ts    # MODYFIKACJA: dodać @OneToMany → Task

apps/api/src/boards/
├── boards.service.ts                  # MODYFIKACJA: findOne() eager load tasks w columns

apps/api/src/app.module.ts             # MODYFIKACJA: import TasksModule
apps/api/src/migrations/               # NOWA migracja: CreateTaskTable
```

## Data Model

### Task Entity

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK (z BaseEntity) |
| title | varchar(255) | NOT NULL |
| description | text | NULLABLE |
| order | int | DEFAULT 0 |
| columnId | UUID | FK → board_columns(id), NOT NULL |
| createdAt | datetime | auto (z BaseEntity) |
| updatedAt | datetime | auto (z BaseEntity) |

**Relations**:
- Task ManyToOne → BoardColumn (onDelete: CASCADE)
- BoardColumn OneToMany → Task

### Eager Loading (Board.findOne)

```
Board → columns (order ASC) → tasks (order ASC)
```

## API Contracts

### POST /tasks
- **Body**: `{ title: string, description?: string, columnId: UUID }`
- **201**: Task created (order auto-assigned)
- **400**: Validation failed
- **404**: Column not found

### GET /columns/:columnId/tasks
- **200**: Task[] sorted by order ASC
- **404**: Column not found

### GET /tasks/:id
- **200**: Task
- **404**: Task not found

### PATCH /tasks/:id
- **Body**: `{ title?: string, description?: string }`
- **200**: Task updated
- **404**: Task not found

### DELETE /tasks/:id
- **200**: Task deleted
- **404**: Task not found

### PATCH /tasks/:id/move
- **Body**: `{ columnId: UUID, order: int (>= 0) }`
- **200**: Task moved (transakcyjnie)
- **404**: Task or target column not found

## Key Technical Decisions

1. **Move endpoint transakcyjny**: `DataSource.createQueryRunner()` — shift orders w target kolumnie, close gap w source kolumnie, update task. Wzorzec z columns.service.ts reorder().

2. **Auto-assign order**: `MAX(order) + 1` w target kolumnie (wzorzec z columns.service.ts create()).

3. **ColumnsService DI**: TasksModule importuje ColumnsModule → ColumnsService do walidacji columnId.

4. **Move w tej samej kolumnie**: Specjalna logika — shift orders w jednym kierunku zamiast source/target.

5. **Order overflow**: Jeśli podany order > count tasków w target → task ląduje na końcu.

## Complexity Tracking

Brak naruszeń konstytucji — standardowy moduł NestJS z transakcyjnym move.

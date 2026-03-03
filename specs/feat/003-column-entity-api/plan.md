# Implementation Plan: BoardColumn Entity & CRUD API

**Branch**: `003-column-entity-api` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-column-entity-api/spec.md`

## Summary

Dodanie encji BoardColumn z pełnym CRUD API do modułu Kanban. Kolumna należy do Boarda (ManyToOne z CASCADE delete), posiada pole `order` do pozycjonowania, i eksponuje endpoint reorder do zmiany kolejności. ColumnsService wstrzykuje BoardsService do walidacji istnienia boarda (SOLID DI). Moduł eksportuje ColumnsService na potrzeby przyszłego feature 004 (Task entity).

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: NestJS 11 (backend), TypeORM 0.3 (ORM)
**Storage**: MariaDB 11 (via Docker)
**Testing**: Jest + Supertest (backend E2E), Jest (unit)
**Project Type**: web-service (monorepo: apps/api)
**Scope**: Backend-only (API) — brak zmian we frontendzie

## Constitution Check

| Article | Rule | Status |
|---------|------|--------|
| II | Logika biznesowa w serwisach, nie kontrolerach | ✅ Plan zgodny |
| II | Walidacja class-validator w DTO | ✅ Plan zgodny |
| II | Swagger dekoratory na każdym endpoincie | ✅ Plan zgodny |
| II | Entity: UUID PK + timestamps (BaseEntity) | ✅ Plan zgodny |
| II | Migracje TypeORM (nie synchronize) | ✅ Plan zgodny |
| IV | Brak `any`, pełne typowanie | ✅ Plan zgodny |
| V | Testy unit + E2E | ✅ Plan zgodny |

## Project Structure

### Documentation (this feature)

```text
specs/003-column-entity-api/
├── spec.md              # Specyfikacja (istnieje)
├── plan.md              # Ten plik
├── data-model.md        # Model danych BoardColumn
└── tasks.md             # Lista zadań
```

### Source Code (nowe/zmienione pliki)

```text
apps/api/src/
├── columns/                              # NOWY moduł
│   ├── columns.module.ts                 # imports: BoardsModule, exports: ColumnsService
│   ├── columns.controller.ts             # CRUD + board-scoped routes
│   ├── columns.service.ts                # Logika biznesowa, DI BoardsService
│   ├── entities/
│   │   └── board-column.entity.ts        # BoardColumn extends BaseEntity
│   └── dto/
│       ├── create-column.dto.ts          # name (required), boardId (required UUID)
│       ├── update-column.dto.ts          # name (optional)
│       └── reorder-columns.dto.ts        # columnIds: string[] (UUID[])
├── boards/
│   └── entities/board.entity.ts          # UPDATE: dodać @OneToMany → BoardColumn
├── app.module.ts                         # UPDATE: import ColumnsModule
└── migrations/
    └── XXXX-CreateBoardColumns.ts        # NOWA migracja
```

## Design Decisions

### 1. Routing — Single controller with explicit paths

Endpointy `/columns/*` i `/boards/:boardId/columns/*` obsługuje jeden `ColumnsController` z `@Controller()` (bez prefixu). Każdy handler ma pełną ścieżkę w dekoratorze (`@Post('columns')`, `@Get('boards/:boardId/columns')`).

**Powód**: Prostsze niż dwa kontrolery, cała logika kolumn w jednym miejscu.

### 2. Auto-assign order

`create()` oblicza `max(order)` dla danego boarda i ustawia `order = max + 1`. Dla pustego boarda `order = 0`.

**Implementacja**: `QueryBuilder` z `MAX(order)` filtrowanym po `boardId`.

### 3. Reorder — bulk update with validation

`reorder(boardId, columnIds[])` najpierw waliduje:
1. Brak duplikatów w `columnIds`
2. Pobranie aktualnych kolumn boarda z DB
3. Sprawdzenie że `columnIds` zawiera dokładnie te same ID co kolumny boarda (nie mniej, nie więcej, nie obce)
4. Iteracja po tablicy i ustawienie `order = index`

Używa transakcji TypeORM dla atomowości. Zwraca 400 BadRequest jeśli walidacja nie przejdzie.

### 4. Board eager loading columns

`Board.findOne()` zostaje zaktualizowane o `relations: ['columns']` z order ASC. Relacja `@OneToMany` na Board entity z `eager: false` (ładowane jawnie w findOne).

### 5. Entity table name

Tabela: `board_columns` (snake_case, z prefixem `board_` bo kolumna należy do boarda, analogicznie do przyszłych `board_tasks`).

## API Contracts

### POST /columns
- Body: `{ name: string, boardId: string (UUID) }`
- Response 201: `BoardColumn` z auto-assigned order
- Response 400: Validation failed
- Response 404: Board not found

### GET /boards/:boardId/columns
- Response 200: `BoardColumn[]` sorted by order ASC
- Response 404: Board not found

### GET /columns/:id
- Response 200: `BoardColumn`
- Response 404: Column not found

### PATCH /columns/:id
- Body: `{ name?: string }`
- Response 200: Updated `BoardColumn`
- Response 404: Column not found

### DELETE /columns/:id
- Response 200: void
- Response 404: Column not found

### PATCH /boards/:boardId/columns/reorder
- Body: `{ columnIds: string[] (UUID[], ArrayNotEmpty) }`
- Response 200: `BoardColumn[]` with updated order
- Response 400: Validation failed (empty array, duplicates, missing columns, foreign columns)
- Response 404: Board not found

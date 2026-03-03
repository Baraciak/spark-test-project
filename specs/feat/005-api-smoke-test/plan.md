# Implementation Plan: API Smoke Tests

**Branch**: `005-api-smoke-test` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-api-smoke-test/spec.md`

## Summary

Dodanie E2E smoke testów dla wszystkich istniejących endpointów API (22 endpointy, 5 modułów). Testy używają Supertest z mockowanymi serwisami NestJS — brak zależności od bazy danych. Każdy moduł dostaje osobny plik testowy w `apps/api/test/`. Pokrycie obejmuje happy paths, walidację i obsługę błędów.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Testing Framework**: Jest 29 + Supertest 7 + @nestjs/testing 11
**Test Type**: E2E (HTTP-level) z mockowanymi serwisami
**Performance Goals**: < 30s (brak I/O bazy)
**Constraints**: Zero zmian w kodzie produkcyjnym
**Scale/Scope**: 5 plików testowych, ~40 test cases

## Constitution Check

| Article | Status | Notes |
|---------|--------|-------|
| Art. V (Testowanie) | Zgodne | E2E testy Supertest na kontrolerach |
| Art. II (Backend) | N/A | Brak zmian w kodzie produkcyjnym |
| Art. IV (TypeScript) | Zgodne | Pełne typowanie w testach, brak `any` |

## Project Structure

### Documentation (this feature)

```text
specs/005-api-smoke-test/
├── spec.md
├── plan.md         # This file
└── tasks.md        # Generated next
```

### Source Code (new files only)

```text
apps/api/test/
├── jest-e2e.json            # Already exists
├── todos.e2e-spec.ts        # Already exists — UPDATE (add missing validation tests)
├── app.e2e-spec.ts          # NEW — health check
├── boards.e2e-spec.ts       # NEW — CRUD + validation
├── columns.e2e-spec.ts      # NEW — CRUD + reorder + validation
└── tasks.e2e-spec.ts        # NEW — CRUD + move + validation
```

## Design Decisions

### 1. Pliki w `test/` (nie w `src/`)

E2E testy idą do `apps/api/test/` — konwencja NestJS. Istniejące `*.controller.spec.ts` w `src/` to unit testy kontrolerów (colocated). Nowe E2E testy w `test/` dają:
- Jasny podział: `src/*.spec.ts` = unit, `test/*.e2e-spec.ts` = E2E
- Dedykowana konfiguracja `jest-e2e.json`
- Mogą być uruchamiane osobno: `npm run test:e2e`

### 2. Mockowane serwisy (bez bazy)

Każdy test tworzy `TestingModule` z mockowanym serwisem. Wzorzec z istniejącego `todos.e2e-spec.ts`:

```typescript
const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  // ...
};

Test.createTestingModule({
  controllers: [XxxController],
  providers: [{ provide: XxxService, useValue: mockService }],
}).compile();
```

### 3. Istniejący `todos.e2e-spec.ts`

Plik już istnieje i pokrywa basic CRUD. Trzeba dodać:
- Test walidacji invalid UUID (400)
- Test non-existent resource (404)

### 4. Wzorzec testów walidacji

Każdy plik E2E zawiera sekcje:
1. `describe('happy path')` — CRUD operations
2. `describe('validation')` — missing fields → 400, invalid UUID → 400
3. `describe('not found')` — non-existent resources → 404

## Complexity Tracking

Brak naruszeń konstytucji. Projekt jest prosty — same pliki testowe, zero kodu produkcyjnego.

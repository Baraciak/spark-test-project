# Tasks: Board Entity & CRUD API

**Branch**: `002-board-entity-api` | **Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Phase 1: Setup — Base Infrastructure

- [x] T001 [P1] Create abstract BaseEntity class in `apps/api/src/common/entities/base.entity.ts` with id (UUID PK), createdAt, updatedAt
- [x] T002 [P1] Create Board entity in `apps/api/src/boards/entities/board.entity.ts` extending BaseEntity with name (string) and description (string nullable)

## Phase 2: DTO & Validation

- [x] T003 [P1] [US1] Create CreateBoardDto in `apps/api/src/boards/dto/create-board.dto.ts` — name required (@IsString, @IsNotEmpty), description optional (@IsOptional, @IsString), Swagger decorators
- [x] T004 [P2] [US4] Create UpdateBoardDto in `apps/api/src/boards/dto/update-board.dto.ts` — all fields optional (@IsOptional), Swagger decorators

## Phase 3: Service — Business Logic

- [x] T005 [P1] [US1-5] Create BoardsService in `apps/api/src/boards/boards.service.ts` — inject Repository<Board>, implement create(), findAll() (DESC), findOne() (NotFoundException), update(), remove()

## Phase 4: Controller — REST Endpoints

- [x] T006 [P1] [US1-5] Create BoardsController in `apps/api/src/boards/boards.controller.ts` — 5 CRUD endpoints with ParseUUIDPipe, Swagger dekoratory (@ApiTags, @ApiOperation, @ApiResponse)

## Phase 5: Module & Registration

- [x] T007 [P1] Create BoardsModule in `apps/api/src/boards/boards.module.ts` — import TypeOrmModule.forFeature([Board]), export BoardsService
- [x] T008 [P1] Update `apps/api/src/app.module.ts` — import BoardsModule
- [x] T009 [P1] Update `apps/api/src/main.ts` — add 'boards' tag to Swagger DocumentBuilder

## Phase 6: Database Migration

- [x] T010 [P1] Generate TypeORM migration for boards table via `npm run migration:generate`

## Phase 7: Testing

- [x] T011 [P1] Create unit tests for BoardsService in `apps/api/src/boards/boards.service.spec.ts` — mock repository, test all 5 methods + NotFoundException
- [x] T012 [P1] Create E2E tests for BoardsController in `apps/api/src/boards/boards.controller.spec.ts` — Supertest, test HTTP status codes (201, 200, 400, 404), validation, ParseUUIDPipe
- [x] T013 [P1] Run `npm test -w apps/api` — 30/30 PASS. Lint: ESLint not configured (pre-existing issue, not related to this feature)

# Spark Test Project

Full-stack monorepo demo — Next.js + NestJS + MariaDB + Docker.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| State Management | Redux Toolkit (createAsyncThunk) |
| UI | MUI 6 + Tailwind CSS 4 (Liquid Glass design) |
| Backend | NestJS 11, Swagger |
| Database | MariaDB 11 + TypeORM |
| Infrastructure | Docker (multi-stage), Docker Compose |
| CI | GitHub Actions |
| Tests | Jest, Testing Library, Supertest |

## Project Structure

```
spark_test_project/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   └── api/          # NestJS backend  (port 3001)
├── packages/         # Shared libs (future)
├── docker-compose.yml
└── docker-compose.dev.yml
```

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose (for database / full stack)

### Local Development

```bash
# Install dependencies
npm install

# Start both apps (requires MariaDB running)
npm run dev

# Or start individually
npm run dev:web   # http://localhost:3000
npm run dev:api   # http://localhost:3001
```

### Docker Development (recommended)

```bash
# Start all services with hot-reload
npm run docker:dev

# Production build
npm run docker:prod

# Stop containers
npm run docker:down
```

### Services

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/docs |
| MariaDB | localhost:3306 |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend locally |
| `npm run build` | Build all workspaces |
| `npm test` | Run all tests |
| `npm run docker:dev` | Docker dev with hot-reload |
| `npm run docker:prod` | Docker production build |
| `npm run docker:down` | Stop Docker containers |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/todos` | Create todo |
| `GET` | `/todos` | List all todos |
| `GET` | `/todos/:id` | Get single todo |
| `PATCH` | `/todos/:id` | Update todo |
| `DELETE` | `/todos/:id` | Delete todo |

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `API_PORT` | `3001` | NestJS port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `DB_HOST` | `localhost` | MariaDB host |
| `DB_PORT` | `3306` | MariaDB port |
| `DB_USER` | `spark` | Database user |
| `DB_PASSWORD` | `spark_secret` | Database password |
| `DB_NAME` | `spark_db` | Database name |
| `BACKEND_URL` | `http://localhost:3001` | API URL for Next.js proxy |

## Testing

```bash
# All tests
npm test

# Backend only
npm test --workspace=apps/api

# Frontend only
npm test --workspace=apps/web

# E2E tests (backend)
npm run test:e2e --workspace=apps/api
```

## Development Workflow (Spec-Driven Development)

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for structured feature development with AI assistance.

### Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed

### Adding a New Feature

Open Claude Code in the project root and run:

```
/start-task "Short description of the feature"
```

Claude will guide you through 4 phases:

```
PHASE 1: SPECIFICATION  → Analyzes codebase, creates spec.md, asks for approval
PHASE 2: PLANNING       → Creates plan.md + tasks.md with tech details
PHASE 3: IMPLEMENTATION → Implements tasks one by one, runs tests
PHASE 4: FINALIZATION   → Updates docs, prepares for commit
```

Each phase pauses for your review before proceeding.

### Manual Commands (step by step)

If you prefer running each step individually:

| Command | What it does |
|---|---|
| `/speckit.specify "desc"` | Create feature spec (branch + `spec.md`) |
| `/speckit.clarify` | Clarify ambiguities in spec |
| `/speckit.plan` | Generate technical plan (`plan.md`) |
| `/speckit.tasks` | Generate task list (`tasks.md`) |
| `/speckit.implement` | Implement all tasks |
| `/speckit.checklist` | Quality checklist |
| `/speckit.analyze` | Cross-artifact consistency check |
| `/speckit.taskstoissues` | Export tasks to GitHub Issues |

### Resuming Work

If you stopped mid-feature, just run `/start-task` again on the same branch. Claude detects existing artifacts and asks which phase to resume from.

### Feature Artifacts

Each feature generates a spec directory:

```
specs/001-feature-name/
├── spec.md           # What to build (requirements, acceptance criteria)
├── plan.md           # How to build it (architecture, tech decisions)
├── data-model.md     # Entity definitions
├── tasks.md          # Task checklist (source of truth)
└── contracts/        # API contracts
```

### Project Conventions

- Branch naming: `001-feature-name`, `002-another-feature` (auto-incremented)
- Constitution: `.specify/memory/constitution.md` (project rules enforced during planning)
- Change log: `DZIENNIK_ZMIAN.md` (updated after each session)
- `tasks.md` is the source of truth for task tracking

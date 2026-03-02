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

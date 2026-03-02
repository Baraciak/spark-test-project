# Dobre Praktyki Programistyczne z Claude Code

> **Wersja:** 2.0 | Marzec 2026
> **Stack:** Next.js 15 / NestJS 11 / TypeORM / MariaDB / TypeScript / Docker

Przewodnik dobrych praktyk współpracy z Claude Code dla full-stack monorepo TypeScript.

---

## Spis treści

1. [Konfiguracja projektu dla Claude Code](#1-konfiguracja-projektu-dla-claude-code)
2. [Dokumentacja API](#2-dokumentacja-api)
3. [Skille Claude Code](#3-skille-claude-code)
4. [Testowanie](#4-testowanie)
5. [Wzorce kodu NestJS](#5-wzorce-kodu-nestjs)
6. [Wzorce kodu Next.js / React](#6-wzorce-kodu-nextjs--react)
7. [CI/CD i automatyzacja](#7-cicd-i-automatyzacja)
8. [Anty-wzorce](#8-anty-wzorce)
9. [Szablony](#9-szablony)

---

## 1. Konfiguracja projektu dla Claude Code

### 1.1 Plik CLAUDE.md

Kluczowy plik kontekstowy dla Claude Code. Umieść go w katalogu głównym projektu.

**Zalecana struktura dla monorepo:**

```markdown
# Nazwa Projektu - Kontekst dla Claude Code

> **Odpowiedzialny:** Imię (rola)
> **Wersja dokumentacji:** X.Y | Miesiąc Rok

## TL;DR (Przeczytaj najpierw)

**Co to jest**: Krótki opis projektu (1-2 zdania)

**Stack technologiczny**: Next.js 15, NestJS 11, TypeORM, MariaDB 11, TypeScript 5.7

**Struktura monorepo**:
- `apps/web` - Frontend (Next.js, port 3000)
- `apps/api` - Backend (NestJS, port 3001)
- `packages/` - Współdzielone biblioteki

**Krytyczne zasady**:
1. Zawsze używaj Docker dla bazy danych
2. DZIENNIK_ZMIAN - po zakończeniu sesji dodaj wpis
3. Walidacja DTO przez class-validator (backend)

---

## Aktualne blokery / Znane problemy

| Problem | Opis | Wpływ | Obejście |
|---------|------|-------|----------|
| ... | ... | ... | ... |

---

## Komendy

```bash
# Uruchomienie dev
docker compose -f docker-compose.dev.yml up -d

# Testy
npm test --workspaces --if-present

# Lint
npm run lint --workspaces --if-present

# Build
npm run build

# Swagger docs
# http://localhost:3001/docs
```

---

## Czego unikać

### Architektura
- **NIE** umieszczaj logiki biznesowej w kontrolerach NestJS
- **NIE** używaj `any` - zawsze typuj

### Baza danych
- **NIE** używaj `synchronize: true` na produkcji
- **NIE** usuwaj rekordów - używaj soft delete
```

### 1.2 Dziennik zmian (DZIENNIK_ZMIAN.md)

**Obowiązkowy po każdej sesji pracy:**

```markdown
# Dziennik Zmian - Nazwa Projektu

Historia prac nad projektem.

---

## 2026-03

### 2026-03-02 (Imię + Claude) - Sesja N

**Temat: Krótki opis głównego zadania**

1. **Nazwa funkcjonalności** - krótki opis
   - Szczegół implementacji
   - Pliki: `apps/api/src/modul/modul.service.ts`

2. **Kolejna funkcjonalność** - opis

**Pliki zmienione:**
- `apps/api/src/todos/todos.service.ts` (update)
- `apps/web/src/components/todos/TodoItem.tsx` (update)
```

### 1.3 Struktura katalogów Claude Code

```
projekt/
├── .claude/
│   ├── settings.local.json    # Lokalne uprawnienia (gitignore)
│   └── skills/                # Skille projektu
│       └── check-docs/
│           └── SKILL.md
├── CLAUDE.md                  # Główny kontekst
├── DZIENNIK_ZMIAN.md          # Historia sesji
└── README.md                  # Dla developerów
```

---

## 2. Dokumentacja API

### 2.1 Swagger z @nestjs/swagger

Dekoratory na kontrolerach i DTO:

```typescript
// Controller
@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created', type: Product })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }
}

// DTO
export class CreateProductDto {
  @ApiProperty({ example: 'Widget', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 19.99, description: 'Price in PLN' })
  @IsNumber()
  @Min(0)
  price: number;
}
```

**Dostęp do dokumentacji:** `http://localhost:3001/docs`

---

## 3. Skille Claude Code

Skille to predefiniowane prompty dla powtarzalnych zadań. Wywołujesz je przez `/nazwa-skilla`.

### 3.1 Struktura skilla

```
.claude/
└── skills/
    └── nazwa-skilla/
        └── SKILL.md
```

**Format pliku SKILL.md:**

```markdown
---
name: nazwa-skilla
description: Krótki opis co skill robi.
---

# Tytuł skilla

Instrukcje dla Claude Code co ma zrobić.

## 1. Pierwszy krok

Opis co zrobić...

## 2. Format raportu

Jak ma wyglądać output...
```

### 3.2 Skill: check-docs

```markdown
---
name: check-docs
description: Sprawdza czy dokumentacja projektu wymaga aktualizacji względem ostatnich zmian w kodzie.
---

# Sprawdzanie aktualności dokumentacji

## 1. Przeczytaj pliki dokumentacji

- `DZIENNIK_ZMIAN.md` - data ostatniego wpisu
- `CLAUDE.md` - sekcje: "Komendy", "Aktualne blokery"
- `README.md` - sekcje z endpointami i komendami

## 2. Sprawdź ostatnie zmiany

```bash
git status
git log --oneline -5
git diff --name-only HEAD~5
```

## 3. Sprawdź moduły NestJS

```bash
ls apps/api/src/
```

Porównaj z dokumentacją w CLAUDE.md i README.md.

## 4. Sprawdź komponenty React

```bash
ls apps/web/src/components/
ls apps/web/src/app/
```

## 5. Raportuj wyniki

| Plik | Status | Uwagi |
|------|--------|-------|
| DZIENNIK_ZMIAN.md | OK/DO AKTUALIZACJI | ... |
| CLAUDE.md | OK/DO AKTUALIZACJI | ... |
| README.md | OK/DO AKTUALIZACJI | ... |

### Nowe elementy do udokumentowania:
- [ ] Element - brak w dokumentacji

### Sugerowane akcje:
1. [konkretna akcja]
```

### 3.3 Skill: commit

```markdown
---
name: commit
description: Analizuje zmiany i generuje commit message w Conventional Commits.
---

# Generowanie commit message

## 1. Sprawdź zmiany

```bash
git status
git diff --staged
```

## 2. Wygeneruj commit message

Format: `type(scope): description`

Typy: feat, fix, docs, refactor, test, chore
Scope: api, web, shared, config

## 3. Wykonaj commit

```bash
git commit -m "type(scope): description"
```
```

---

## 4. Testowanie

### 4.1 Struktura testów

```
apps/
├── api/
│   └── src/
│       └── todos/
│           ├── todos.service.spec.ts      # Unit test serwisu
│           └── todos.controller.spec.ts   # Unit test kontrolera
│   └── test/
│       └── app.e2e-spec.ts               # E2E test (Supertest)
└── web/
    └── src/
        ├── components/
        │   └── todos/
        │       └── __tests__/
        │           └── TodoItem.test.tsx   # Test komponentu
        └── store/
            └── __tests__/
                └── todosSlice.test.ts      # Test Redux store
```

### 4.2 Test jednostkowy serwisu NestJS

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { NotFoundException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let repository: jest.Mocked<Repository<Todo>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TodosService);
    repository = module.get(getRepositoryToken(Todo));
  });

  describe('create', () => {
    it('should create and save a todo', async () => {
      const dto = { title: 'Test todo' };
      const todo = { id: 'uuid-1', title: 'Test todo', completed: false } as Todo;

      repository.create.mockReturnValue(todo);
      repository.save.mockResolvedValue(todo);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(todo);
      expect(result).toEqual(todo);
    });
  });

  describe('findOne', () => {
    it('should return a todo', async () => {
      const todo = { id: 'uuid-1', title: 'Test' } as Todo;
      repository.findOne.mockResolvedValue(todo);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
```

### 4.3 Test E2E NestJS (Supertest)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Todos (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /todos - should create a todo', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'E2E test todo' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('E2E test todo');
        expect(res.body.completed).toBe(false);
      });
  });

  it('POST /todos - should reject empty title', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ title: '' })
      .expect(400);
  });

  it('GET /todos - should return array', () => {
    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

### 4.4 Test komponentu React (Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '@/store/todosSlice';
import TodoItem from '@/components/todos/TodoItem';

const createMockStore = (initialTodos = []) =>
  configureStore({
    reducer: { todos: todosReducer },
    preloadedState: { todos: { items: initialTodos, status: 'succeeded', error: null } },
  });

describe('TodoItem', () => {
  const mockTodo = {
    id: 'uuid-1',
    title: 'Test todo',
    completed: false,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  };

  it('should render todo title', () => {
    const store = createMockStore([mockTodo]);

    render(
      <Provider store={store}>
        <TodoItem todo={mockTodo} index={0} />
      </Provider>,
    );

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('should show checkbox unchecked for incomplete todo', () => {
    const store = createMockStore([mockTodo]);

    render(
      <Provider store={store}>
        <TodoItem todo={mockTodo} index={0} />
      </Provider>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});
```

### 4.5 Test Redux async thunks

```typescript
import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { fetchTodos, addTodo, TodosState } from '@/store/todosSlice';
import { todosApi } from '@/services/api';

jest.mock('@/services/api');
const mockedApi = todosApi as jest.Mocked<typeof todosApi>;

describe('todosSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { todos: todosReducer } });
  });

  it('should set loading state on fetchTodos.pending', () => {
    // dispatch without resolving
    store.dispatch(fetchTodos());
    const state = store.getState().todos as TodosState;
    expect(state.status).toBe('loading');
  });

  it('should populate items on fetchTodos.fulfilled', async () => {
    const todos = [{ id: '1', title: 'Test', completed: false }];
    mockedApi.getAll.mockResolvedValue(todos);

    await store.dispatch(fetchTodos());
    const state = store.getState().todos as TodosState;

    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(todos);
  });

  it('should add todo at beginning on addTodo.fulfilled', async () => {
    const newTodo = { id: '2', title: 'New', completed: false };
    mockedApi.create.mockResolvedValue(newTodo);

    await store.dispatch(addTodo('New'));
    const state = store.getState().todos as TodosState;

    expect(state.items[0]).toEqual(newTodo);
  });
});
```

---

## 5. Wzorce kodu NestJS

### 5.1 Moduł = Controller + Service + Entity + DTO

Każdy zasób to osobny moduł NestJS:

```
src/
└── products/
    ├── products.module.ts          # Rejestracja modułu
    ├── products.controller.ts      # Endpointy REST
    ├── products.service.ts         # Logika biznesowa
    ├── entities/
    │   └── product.entity.ts       # TypeORM entity
    └── dto/
        ├── create-product.dto.ts   # Walidacja tworzenia
        └── update-product.dto.ts   # Walidacja aktualizacji
```

### 5.2 Walidacja z class-validator

Zawsze waliduj dane wejściowe przez DTO:

```typescript
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Widget' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 19.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'A great widget' })
  @IsString()
  @IsOptional()
  description?: string;
}
```

`ValidationPipe` jest włączony globalnie w `main.ts` z opcjami `whitelist: true` (usuwa nieznane pola) i `transform: true` (auto-konwersja typów).

### 5.3 Logika biznesowa w serwisach, nie w kontrolerach

```typescript
// TAK - kontroler deleguje do serwisu
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }
}

// NIE - logika w kontrolerze
@Controller('products')
export class ProductsController {
  @Post()
  async create(@Body() dto: CreateProductDto) {
    const exists = await this.repo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException();
    const product = this.repo.create(dto);
    // ...50 linii logiki
  }
}
```

### 5.4 TypeORM Entity

```typescript
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 5.5 Exception Filters

NestJS obsługuje wyjątki automatycznie. Używaj wbudowanych:

```typescript
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

// W serwisie:
async findOne(id: string): Promise<Product> {
  const product = await this.repo.findOne({ where: { id } });
  if (!product) {
    throw new NotFoundException(`Product #${id} not found`);
  }
  return product;
}
```

---

## 6. Wzorce kodu Next.js / React

### 6.1 App Router - struktura stron

```
apps/web/src/
├── app/
│   ├── layout.tsx          # Root layout (providers, theme)
│   ├── page.tsx            # Strona główna
│   └── products/
│       ├── page.tsx        # Lista produktów
│       └── [id]/
│           └── page.tsx    # Szczegóły produktu
├── components/
│   ├── layout/             # Komponenty layoutu
│   └── products/           # Komponenty domenowe
├── store/                  # Redux Toolkit
│   ├── store.ts
│   ├── hooks.ts            # useAppDispatch, useAppSelector
│   └── productsSlice.ts
├── services/               # Wywołania API (Axios)
│   └── api.ts
├── types/                  # Typy TypeScript
│   └── product.ts
└── theme/                  # MUI theme
    └── theme.ts
```

### 6.2 Redux Toolkit - async thunks

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => productsApi.getAll(),
);

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null } as ProductsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed';
      });
  },
});
```

### 6.3 Serwis API (Axios)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },
  create: async (dto: CreateProductDto): Promise<Product> => {
    const { data } = await api.post('/products', dto);
    return data;
  },
  update: async (id: string, dto: Partial<Product>): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}`, dto);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
```

### 6.4 Komponenty: 'use client' tylko gdy potrzebne

```typescript
// Server Component (domyślne w App Router) - nie wymaga 'use client'
// Używaj do: fetch danych, statycznego renderowania
export default function ProductsPage() {
  return <ProductList />;
}

// Client Component - wymaga 'use client'
// Używaj do: interakcji, hooks, event handlers, Redux
'use client';
export default function ProductItem({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  // ...
}
```

---

## 7. CI/CD i automatyzacja

### 7.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mariadb:
        image: mariadb:11
        env:
          MARIADB_ROOT_PASSWORD: test
          MARIADB_DATABASE: spark_db
          MARIADB_USER: spark
          MARIADB_PASSWORD: spark_secret
        ports:
          - 3306:3306
        options: >-
          --health-cmd="healthcheck.sh --connect"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci

      - run: npm run lint --workspaces --if-present

      - run: npm test --workspaces --if-present
        env:
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_USER: spark
          DB_PASSWORD: spark_secret
          DB_NAME: spark_db

      - run: npm run build
```

### 7.2 Docker (multi-stage builds)

Projekt używa wieloetapowych buildów Docker dla optymalizacji:

```dockerfile
# Etap 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Etap 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Etap 3: Runtime (minimalny obraz)
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
```

### 7.3 Pre-commit hooks (opcjonalnie)

```bash
#!/bin/bash
# .husky/pre-commit

echo "Running pre-commit checks..."

# TypeScript check
npx tsc --noEmit --project apps/api/tsconfig.json
npx tsc --noEmit --project apps/web/tsconfig.json

# Lint
npm run lint --workspaces --if-present

# Unit tests
npm test --workspaces --if-present

echo "All checks passed!"
```

---

## 8. Anty-wzorce

### 8.1 Architektura

| NIE | TAK |
|-----|-----|
| Logika biznesowa w kontrolerach | Delegacja do serwisów (DI) |
| `any` w TypeScript | Prawidłowe typy i interfejsy |
| `synchronize: true` na produkcji | Migracje TypeORM |
| Hardcoded config | `ConfigModule` + `.env` |
| Bezpośredni import między apps/ | Shared packages w `packages/` |

### 8.2 Kod TypeScript

```typescript
// NIE: any
const data: any = await response.json();

// TAK: typed
interface ApiResponse<T> { data: T; message: string; }
const { data } = await api.get<ApiResponse<Product[]>>('/products');
```

```typescript
// NIE: logika w komponencie
export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);
}

// TAK: Redux + serwis API
export default function ProductList() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(state => state.products);
  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);
}
```

### 8.3 Testy

| NIE | TAK |
|-----|-----|
| Prawdziwa baza w unit testach | Mockuj repository (`jest.fn()`) |
| Brak testów walidacji DTO | Testuj rejected payloads |
| Testy bez asercji | Każdy test musi coś asertować |
| Import relative paths w testach web | `@/` path alias |

### 8.4 Dokumentacja

| NIE | TAK |
|-----|-----|
| Brak CLAUDE.md | Zawsze twórz kontekst dla Claude |
| Brak dziennika zmian | Wpis po każdej sesji |
| Endpointy bez Swagger dekoratorów | `@ApiOperation` + `@ApiResponse` na każdym |
| TODO bez kontekstu | `// TODO(imię): opis - data` |

---

## 9. Szablony

### 9.1 Szablon nowego modułu NestJS

```bash
# Generowanie przez NestJS CLI
npx nest generate resource nazwa-modulu --no-spec
```

To wygeneruje: module, controller, service, entity, DTO (create + update).

**Ręczna struktura:**

```
src/nazwa-modulu/
├── nazwa-modulu.module.ts
├── nazwa-modulu.controller.ts
├── nazwa-modulu.service.ts
├── entities/
│   └── nazwa-modulu.entity.ts
└── dto/
    ├── create-nazwa-modulu.dto.ts
    └── update-nazwa-modulu.dto.ts
```

**Entity:**

```typescript
@Entity('nazwa_tabeli')
export class NazwaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Service:**

```typescript
@Injectable()
export class NazwaService {
  constructor(
    @InjectRepository(NazwaEntity)
    private readonly repo: Repository<NazwaEntity>,
  ) {}

  create(dto: CreateNazwaDto): Promise<NazwaEntity> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll(): Promise<NazwaEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<NazwaEntity> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`#${id} not found`);
    return entity;
  }
}
```

### 9.2 Szablon nowego komponentu React

```typescript
'use client';

import { Box, Typography } from '@mui/material';

interface NazwaProps {
  data: DataType;
}

export default function Nazwa({ data }: NazwaProps) {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ /* styles */ }}>
      <Typography variant="body1">{data.name}</Typography>
    </Box>
  );
}
```

### 9.3 Szablon nowego skilla

```markdown
---
name: nazwa-skilla
description: Krótki opis co skill robi (max 1-2 zdania).
---

# Tytuł skilla

Instrukcje dla Claude Code.

## 1. Pierwszy krok

Opis co zrobić.

```bash
# Komendy do wykonania
```

## 2. Format raportu

Jak ma wyglądać output.
```

---

## Checklist dla nowego modułu

- [ ] Entity z TypeORM dekoratorami
- [ ] DTO z class-validator + @nestjs/swagger
- [ ] Service z logiką biznesową
- [ ] Controller z Swagger dekoratorami
- [ ] Module zarejestrowany w AppModule
- [ ] Testy jednostkowe serwisu
- [ ] Test E2E endpointów
- [ ] Komponent React (jeśli potrzebny)
- [ ] Redux slice (jeśli potrzebny)
- [ ] Wpis w DZIENNIK_ZMIAN.md

---

> **Licencja:** Do użytku wewnętrznego

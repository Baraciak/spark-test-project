# NestJS dla programisty Laravel - Ściągawka

## Porównanie struktur plików

```
Laravel                          NestJS
──────────────────────────────── ────────────────────────────────
app/Http/Controllers/            src/todos/todos.controller.ts
app/Services/                    src/todos/todos.service.ts
app/Models/                      src/todos/entities/todo.entity.ts
app/Http/Requests/               src/todos/dto/create-todo.dto.ts
database/migrations/             src/migrations/
routes/api.php                   dekoratory @Get/@Post w kontrolerze
config/database.php              app.module.ts (TypeORM config)
app/Providers/AppServiceProvider src/todos/todos.module.ts
```

---

## 1. Moduł = Service Provider

```php
// Laravel
class AppServiceProvider {
    public function register() {
        $this->app->bind(TodoService::class);
    }
}
```

```typescript
// NestJS
@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
```

- `providers` = klasy które NestJS może wstrzykiwać (jak `$this->app->bind()`)
- `controllers` = klasy obsługujące HTTP
- `imports` = inne moduły, z których korzystasz

---

## 2. Entity = Model Eloquent

```php
// Laravel
class Todo extends Model {
    protected $table = 'todos';
    protected $fillable = ['title', 'completed'];
    protected $casts = ['completed' => 'boolean'];
}
```

```typescript
// NestJS (TypeORM)
@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

| Eloquent | TypeORM | Co robi |
|----------|---------|---------|
| `$fillable` | dekoratory `@Column()` | definiuje pola |
| `$casts` | typ TypeScript + dekorator | rzutowanie typów |
| `$table` | `@Entity('todos')` | nazwa tabeli |
| `timestamps` | `@CreateDateColumn` / `@UpdateDateColumn` | automatyczne daty |
| `$primaryKey` | `@PrimaryGeneratedColumn('uuid')` | klucz główny |

---

## 3. DTO = Form Request

```php
// Laravel
class CreateTodoRequest extends FormRequest {
    public function rules() {
        return ['title' => 'required|string'];
    }
}
```

```typescript
// NestJS
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
```

W Laravel walidacja jest w `rules()`. W NestJS - przez dekoratory `class-validator` na polach. Efekt ten sam: niepoprawne dane = automatyczny błąd 400.

---

## 4. Controller = Controller

```php
// Laravel
class TodoController extends Controller {
    // Route::post('/todos')
    public function store(CreateTodoRequest $request) {
        return $this->todoService->create($request->validated());
    }

    // Route::get('/todos/{id}')
    public function show(string $id) {
        return $this->todoService->findOne($id);
    }
}
```

```typescript
// NestJS
@Controller('todos')
export class TodosController {
  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }
}
```

| Laravel | NestJS | Co robi |
|---------|--------|---------|
| `Route::get('/todos')` | `@Get()` na metodzie | definiuje routing |
| `$request->validated()` | `@Body() dto` | wyciąga zwalidowane dane |
| `$id` z route | `@Param('id') id` | parametr z URL |
| `Route::prefix('todos')` | `@Controller('todos')` | prefix ścieżki |

Kluczowa różnica: w Laravel routing jest w `routes/api.php`. W NestJS routing jest **przy metodzie** przez dekoratory.

---

## 5. Service = Service

```php
// Laravel
class TodoService {
    public function __construct(private TodoRepository $repo) {}

    public function create(array $data) {
        return $this->repo->create($data);
    }

    public function findOne(string $id) {
        return $this->repo->findOrFail($id);
    }
}
```

```typescript
// NestJS
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepo: Repository<Todo>,
  ) {}

  create(dto: CreateTodoDto) {
    const todo = this.todosRepo.create(dto);
    return this.todosRepo.save(todo);
  }

  async findOne(id: string) {
    const todo = await this.todosRepo.findOne({ where: { id } });
    if (!todo) throw new NotFoundException();
    return todo;
  }
}
```

| Eloquent / Laravel | TypeORM / NestJS | Co robi |
|--------------------|------------------|---------|
| `Todo::create($data)` | `repo.create(dto)` + `repo.save(todo)` | tworzenie rekordu |
| `Todo::findOrFail($id)` | `repo.findOne()` + `throw NotFoundException` | szukaj lub błąd |
| `$todo->update($data)` | `Object.assign(todo, dto)` + `repo.save()` | aktualizacja |
| `$todo->delete()` | `repo.remove(todo)` | usunięcie |

---

## 6. Dependency Injection

```php
// Laravel - automatyczne przez type-hint
public function __construct(private TodoService $service) {}
```

```typescript
// NestJS - automatyczne przez typ w constructor
constructor(private readonly todosService: TodosService) {}
```

Działa identycznie. Framework widzi typ, szuka go w kontenerze, wstrzykuje.

---

## 7. Przepływ requestu

```
Laravel:
  Request → Route → Middleware → FormRequest (walidacja) → Controller → Service → Model → DB

NestJS:
  Request → Dekorator routingu → Pipe (walidacja DTO) → Controller → Service → Repository → DB
```

---

## 8. Migracje

```bash
# Laravel                                # NestJS (TypeORM)
php artisan make:migration xyz            npm run migration:generate -- src/migrations/Xyz
php artisan migrate                       npm run migration:run
php artisan migrate:rollback              npm run migration:revert
php artisan migrate:status                npm run migration:show
```

| Laravel | NestJS | Co robi |
|---------|--------|---------|
| `php artisan make:migration` | `npm run migration:generate` | Generuje migrację (TypeORM porównuje entity z bazą i tworzy diff) |
| `php artisan migrate` | `npm run migration:run` | Uruchamia oczekujące migracje |
| `php artisan migrate:rollback` | `npm run migration:revert` | Cofa ostatnią migrację |
| `php artisan migrate:status` | `npm run migration:show` | Pokazuje status migracji (`[X]` = wykonana, `[ ]` = oczekująca) |
| `migrate` w `AppServiceProvider::boot()` | `migrationsRun: true` w `app.module.ts` | Automatyczne uruchomienie migracji przy starcie aplikacji |

Pliki konfiguracyjne:
- `src/data-source.ts` - DataSource dla CLI (odpowiednik `config/database.php`)
- `src/migrations/` - katalog z migracjami (odpowiednik `database/migrations/`)
- `app.module.ts` - `synchronize: false` + `migrationsRun: true`

---

## 9. Podsumowanie

| Koncept | Laravel | NestJS |
|---------|---------|--------|
| Struktura | `app/Http/`, `app/Models/` | Moduły (`todos/`) |
| Routing | `routes/api.php` | Dekoratory `@Get()`, `@Post()` |
| Walidacja | `FormRequest` + `rules()` | DTO + dekoratory `@IsString()` |
| ORM | Eloquent | TypeORM |
| Model | `extends Model` | `@Entity()` |
| Migracje | `php artisan migrate` | `typeorm migration:run` |
| DI | ServiceProvider | Module (`providers`) |
| Middleware | Middleware | Guards / Interceptors / Pipes |
| Wyjątki | `abort(404)` | `throw new NotFoundException()` |
| CLI generator | `php artisan make:model` | `nest generate resource` |
| Env config | `.env` + `config()` | `process.env` / `ConfigModule` |
| Dokumentacja API | brak (osobne narzędzia) | Swagger wbudowany (`@nestjs/swagger`) |

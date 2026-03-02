import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { TodosController } from '../src/todos/todos.controller';
import { TodosService } from '../src/todos/todos.service';

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let service: jest.Mocked<TodosService>;

  const mockTodo = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'E2E Test todo',
    completed: false,
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    service = moduleFixture.get(TodosService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /todos', () => {
    it('should create a todo and return 201', async () => {
      service.create.mockResolvedValue(mockTodo);

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'E2E Test todo' })
        .expect(201);

      expect(response.body.title).toBe('E2E Test todo');
      expect(service.create).toHaveBeenCalled();
    });

    it('should return 400 when title is missing', async () => {
      await request(app.getHttpServer()).post('/todos').send({}).expect(400);
    });

    it('should return 400 when title is empty string', async () => {
      await request(app.getHttpServer())
        .post('/todos')
        .send({ title: '' })
        .expect(400);
    });

    it('should strip extra fields (whitelist)', async () => {
      service.create.mockResolvedValue(mockTodo);

      await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Test', extra: 'should be stripped' })
        .expect(201);

      expect(service.create).toHaveBeenCalledWith({ title: 'Test' });
    });
  });

  describe('GET /todos', () => {
    it('should return all todos', async () => {
      service.findAll.mockResolvedValue([mockTodo]);

      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });

    it('should return empty array when no todos', async () => {
      service.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a single todo', async () => {
      service.findOne.mockResolvedValue(mockTodo);

      const response = await request(app.getHttpServer())
        .get(`/todos/${mockTodo.id}`)
        .expect(200);

      expect(response.body.id).toBe(mockTodo.id);
    });

    it('should return 404 when todo not found', async () => {
      service.findOne.mockRejectedValue(
        new NotFoundException('Todo not found'),
      );

      await request(app.getHttpServer())
        .get(`/todos/${mockTodo.id}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/todos/not-a-uuid')
        .expect(400);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update a todo', async () => {
      const updated = { ...mockTodo, completed: true };
      service.update.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch(`/todos/${mockTodo.id}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('should return 200 with empty body (no changes)', async () => {
      service.update.mockResolvedValue(mockTodo);

      await request(app.getHttpServer())
        .patch(`/todos/${mockTodo.id}`)
        .send({})
        .expect(200);
    });

    it('should return 404 when todo not found', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Todo not found'),
      );

      await request(app.getHttpServer())
        .patch(`/todos/${mockTodo.id}`)
        .send({ completed: true })
        .expect(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo and return 200', async () => {
      service.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/todos/${mockTodo.id}`)
        .expect(200);

      expect(service.remove).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should return 404 when todo not found', async () => {
      service.remove.mockRejectedValue(
        new NotFoundException('Todo not found'),
      );

      await request(app.getHttpServer())
        .delete(`/todos/${mockTodo.id}`)
        .expect(404);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TodosController } from '../src/todos/todos.controller';
import { TodosService } from '../src/todos/todos.service';

const mockTodo = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'E2E Test todo',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockTodosService = {
  create: jest.fn().mockResolvedValue(mockTodo),
  findAll: jest.fn().mockResolvedValue([mockTodo]),
  findOne: jest.fn().mockResolvedValue(mockTodo),
  update: jest.fn().mockResolvedValue({ ...mockTodo, completed: true }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('TodosController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: mockTodosService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /todos — should create a todo', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'E2E Test todo' })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('E2E Test todo');
      });
  });

  it('GET /todos — should return all todos', () => {
    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('GET /todos/:id — should return a single todo', () => {
    return request(app.getHttpServer())
      .get(`/todos/${mockTodo.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(mockTodo.id);
      });
  });

  it('PATCH /todos/:id — should update a todo', () => {
    return request(app.getHttpServer())
      .patch(`/todos/${mockTodo.id}`)
      .send({ completed: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.completed).toBe(true);
      });
  });

  it('DELETE /todos/:id — should delete a todo', () => {
    return request(app.getHttpServer())
      .delete(`/todos/${mockTodo.id}`)
      .expect(200);
  });

  it('POST /todos — should reject empty title', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ title: '' })
      .expect(400);
  });
});

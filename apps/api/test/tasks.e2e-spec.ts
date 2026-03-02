import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { TasksController } from '../src/tasks/tasks.controller';
import { TasksService } from '../src/tasks/tasks.service';
import { Task } from '../src/tasks/entities/task.entity';
import { BoardColumn } from '../src/columns/entities/board-column.entity';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let service: jest.Mocked<TasksService>;

  const columnIdA = '550e8400-e29b-41d4-a716-446655440000';
  const columnIdB = '660e8400-e29b-41d4-a716-446655440001';
  const taskId = '770e8400-e29b-41d4-a716-446655440002';

  const mockTask: Task = {
    id: taskId,
    title: 'Login page',
    description: 'Implement login',
    order: 0,
    columnId: columnIdA,
    column: {} as BoardColumn,
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAllByColumn: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            move: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    service = module.get(TasksService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a task and return 201', async () => {
      service.create.mockResolvedValue(mockTask);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Login page', columnId: columnIdA })
        .expect(201);

      expect(response.body.title).toBe('Login page');
      expect(response.body.order).toBe(0);
      expect(service.create).toHaveBeenCalled();
    });

    it('should create a task with description', async () => {
      service.create.mockResolvedValue(mockTask);

      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Login page',
          description: 'Implement login',
          columnId: columnIdA,
        })
        .expect(201);
    });

    it('should return 400 when title is missing', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ columnId: columnIdA })
        .expect(400);
    });

    it('should return 400 when columnId is missing', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Test' })
        .expect(400);
    });

    it('should return 400 when columnId is not a UUID', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Test', columnId: 'not-uuid' })
        .expect(400);
    });

    it('should return 400 when title exceeds 255 characters', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'a'.repeat(256), columnId: columnIdA })
        .expect(400);
    });

    it('should return 404 when column does not exist', async () => {
      service.create.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Test', columnId: columnIdA })
        .expect(404);
    });
  });

  describe('GET /columns/:columnId/tasks', () => {
    it('should return tasks sorted by order', async () => {
      const tasks = [
        { ...mockTask, order: 0 },
        { ...mockTask, id: 'id-2', title: 'Signup page', order: 1 },
      ];
      service.findAllByColumn.mockResolvedValue(tasks);

      const response = await request(app.getHttpServer())
        .get(`/columns/${columnIdA}/tasks`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Login page');
    });

    it('should return empty array when no tasks', async () => {
      service.findAllByColumn.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get(`/columns/${columnIdA}/tasks`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 400 for invalid column UUID', async () => {
      await request(app.getHttpServer())
        .get('/columns/not-a-uuid/tasks')
        .expect(400);
    });

    it('should return 404 when column not found', async () => {
      service.findAllByColumn.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .get(`/columns/${columnIdA}/tasks`)
        .expect(404);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by id', async () => {
      service.findOne.mockResolvedValue(mockTask);

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
    });

    it('should return 404 when task not found', async () => {
      service.findOne.mockRejectedValue(
        new NotFoundException('Task not found'),
      );

      await request(app.getHttpServer()).get(`/tasks/${taskId}`).expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/tasks/not-a-uuid')
        .expect(400);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update and return the task', async () => {
      const updated = { ...mockTask, title: 'Updated' };
      service.update.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ title: 'Updated' })
        .expect(200);

      expect(response.body.title).toBe('Updated');
    });

    it('should return 200 with empty body (no changes)', async () => {
      service.update.mockResolvedValue(mockTask);

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({})
        .expect(200);
    });

    it('should return 404 when task not found', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Task not found'),
      );

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ title: 'X' })
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete and return 200', async () => {
      service.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(200);

      expect(service.remove).toHaveBeenCalledWith(taskId);
    });

    it('should return 404 when task not found', async () => {
      service.remove.mockRejectedValue(
        new NotFoundException('Task not found'),
      );

      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id/move', () => {
    it('should move task to another column and return 200', async () => {
      const moved = { ...mockTask, columnId: columnIdB, order: 0 };
      service.move.mockResolvedValue(moved);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: columnIdB, order: 0 })
        .expect(200);

      expect(response.body.columnId).toBe(columnIdB);
      expect(response.body.order).toBe(0);
    });

    it('should return 400 when columnId is missing', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ order: 0 })
        .expect(400);
    });

    it('should return 400 when order is missing', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: columnIdB })
        .expect(400);
    });

    it('should return 400 when order is negative', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: columnIdB, order: -1 })
        .expect(400);
    });

    it('should return 400 when columnId is not a UUID', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: 'not-uuid', order: 0 })
        .expect(400);
    });

    it('should return 404 when task not found', async () => {
      service.move.mockRejectedValue(
        new NotFoundException('Task not found'),
      );

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: columnIdB, order: 0 })
        .expect(404);
    });

    it('should return 404 when target column not found', async () => {
      service.move.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: columnIdB, order: 0 })
        .expect(404);
    });

    it('should return 400 for invalid task UUID', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/not-a-uuid/move')
        .send({ columnId: columnIdB, order: 0 })
        .expect(400);
    });
  });
});

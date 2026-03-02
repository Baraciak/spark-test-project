import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let app: INestApplication;
  let service: jest.Mocked<TasksService>;

  const columnId = '550e8400-e29b-41d4-a716-446655440000';
  const columnIdB = '550e8400-e29b-41d4-a716-446655440099';
  const taskId = '660e8400-e29b-41d4-a716-446655440001';

  const mockTask: Task = {
    id: taskId,
    title: 'Login page',
    description: null,
    order: 0,
    columnId,
    column: {} as Task['column'],
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
        .send({ title: 'Login page', columnId })
        .expect(201);

      expect(response.body.title).toBe('Login page');
      expect(response.body.order).toBe(0);
      expect(service.create).toHaveBeenCalled();
    });

    it('should create a task with description', async () => {
      const taskWithDesc = { ...mockTask, description: 'OAuth flow' };
      service.create.mockResolvedValue(taskWithDesc);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Login page', description: 'OAuth flow', columnId })
        .expect(201);

      expect(response.body.description).toBe('OAuth flow');
    });

    it('should return 400 when title is missing', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ columnId })
        .expect(400);
    });

    it('should return 400 when title is empty string', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: '', columnId })
        .expect(400);
    });

    it('should return 400 when columnId is missing', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task' })
        .expect(400);
    });

    it('should return 400 when columnId is not a UUID', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task', columnId: 'not-uuid' })
        .expect(400);
    });

    it('should return 400 when title exceeds 255 characters', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'a'.repeat(256), columnId })
        .expect(400);
    });

    it('should return 404 when column does not exist', async () => {
      service.create.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task', columnId })
        .expect(404);
    });
  });

  describe('GET /columns/:columnId/tasks', () => {
    it('should return tasks sorted by order', async () => {
      const tasks = [
        { ...mockTask, order: 0 },
        { ...mockTask, id: 'id-2', title: 'Task 2', order: 1 },
      ];
      service.findAllByColumn.mockResolvedValue(tasks);

      const response = await request(app.getHttpServer())
        .get(`/columns/${columnId}/tasks`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Login page');
    });

    it('should return empty array when no tasks', async () => {
      service.findAllByColumn.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get(`/columns/${columnId}/tasks`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/columns/not-a-uuid/tasks')
        .expect(400);
    });

    it('should return 404 when column not found', async () => {
      service.findAllByColumn.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .get(`/columns/${columnId}/tasks`)
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

      await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/tasks/not-a-uuid')
        .expect(400);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update and return the task', async () => {
      const updated = { ...mockTask, title: 'New title' };
      service.update.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ title: 'New title' })
        .expect(200);

      expect(response.body.title).toBe('New title');
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

    it('should return 400 when title exceeds 255 characters', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ title: 'a'.repeat(256) })
        .expect(400);
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
    it('should move task and return 200', async () => {
      const movedTask = { ...mockTask, columnId: columnIdB, order: 1 };
      service.move.mockResolvedValue(movedTask);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: columnIdB, order: 1 })
        .expect(200);

      expect(response.body.columnId).toBe(columnIdB);
      expect(response.body.order).toBe(1);
      expect(service.move).toHaveBeenCalledWith(taskId, {
        columnId: columnIdB,
        order: 1,
      });
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
        .send({ columnId })
        .expect(400);
    });

    it('should return 400 when order is negative', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId, order: -1 })
        .expect(400);
    });

    it('should return 400 when columnId is not a UUID', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId: 'not-uuid', order: 0 })
        .expect(400);
    });

    it('should return 400 for invalid task UUID', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/not-a-uuid/move')
        .send({ columnId, order: 0 })
        .expect(400);
    });

    it('should return 404 when task not found', async () => {
      service.move.mockRejectedValue(
        new NotFoundException('Task not found'),
      );

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/move`)
        .send({ columnId, order: 0 })
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
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { BoardsController } from '../src/boards/boards.controller';
import { BoardsService } from '../src/boards/boards.service';
import { Board } from '../src/boards/entities/board.entity';

describe('BoardsController (e2e)', () => {
  let app: INestApplication;
  let service: jest.Mocked<BoardsService>;

  const mockBoard: Board = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Sprint 1',
    description: 'First sprint board',
    columns: [],
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        {
          provide: BoardsService,
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

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    service = module.get(BoardsService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /boards', () => {
    it('should create a board and return 201', async () => {
      service.create.mockResolvedValue(mockBoard);

      const response = await request(app.getHttpServer())
        .post('/boards')
        .send({ name: 'Sprint 1', description: 'First sprint board' })
        .expect(201);

      expect(response.body.name).toBe('Sprint 1');
      expect(service.create).toHaveBeenCalled();
    });

    it('should return 400 when name is missing', async () => {
      await request(app.getHttpServer()).post('/boards').send({}).expect(400);
    });

    it('should return 400 when name is empty string', async () => {
      await request(app.getHttpServer())
        .post('/boards')
        .send({ name: '' })
        .expect(400);
    });

    it('should strip extra fields (whitelist)', async () => {
      service.create.mockResolvedValue(mockBoard);

      await request(app.getHttpServer())
        .post('/boards')
        .send({ name: 'Sprint 1', extra: 'stripped' })
        .expect(201);

      expect(service.create).toHaveBeenCalledWith({ name: 'Sprint 1' });
    });
  });

  describe('GET /boards', () => {
    it('should return all boards', async () => {
      service.findAll.mockResolvedValue([mockBoard]);

      const response = await request(app.getHttpServer())
        .get('/boards')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Sprint 1');
    });

    it('should return empty array when no boards', async () => {
      service.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/boards')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /boards/:id', () => {
    it('should return a board with columns', async () => {
      service.findOne.mockResolvedValue(mockBoard);

      const response = await request(app.getHttpServer())
        .get(`/boards/${mockBoard.id}`)
        .expect(200);

      expect(response.body.id).toBe(mockBoard.id);
      expect(Array.isArray(response.body.columns)).toBe(true);
    });

    it('should return 404 when board not found', async () => {
      service.findOne.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await request(app.getHttpServer())
        .get(`/boards/${mockBoard.id}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/boards/not-a-uuid')
        .expect(400);
    });
  });

  describe('PATCH /boards/:id', () => {
    it('should update and return the board', async () => {
      const updated = { ...mockBoard, name: 'Sprint 2' };
      service.update.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch(`/boards/${mockBoard.id}`)
        .send({ name: 'Sprint 2' })
        .expect(200);

      expect(response.body.name).toBe('Sprint 2');
    });

    it('should return 200 with empty body (no changes)', async () => {
      service.update.mockResolvedValue(mockBoard);

      await request(app.getHttpServer())
        .patch(`/boards/${mockBoard.id}`)
        .send({})
        .expect(200);
    });

    it('should return 404 when board not found', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await request(app.getHttpServer())
        .patch(`/boards/${mockBoard.id}`)
        .send({ name: 'X' })
        .expect(404);
    });
  });

  describe('DELETE /boards/:id', () => {
    it('should delete and return 200', async () => {
      service.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/boards/${mockBoard.id}`)
        .expect(200);

      expect(service.remove).toHaveBeenCalledWith(mockBoard.id);
    });

    it('should return 404 when board not found', async () => {
      service.remove.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await request(app.getHttpServer())
        .delete(`/boards/${mockBoard.id}`)
        .expect(404);
    });
  });
});

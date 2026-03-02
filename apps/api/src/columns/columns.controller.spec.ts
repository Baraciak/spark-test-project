import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { BoardColumn } from './entities/board-column.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ColumnsController', () => {
  let app: INestApplication;
  let service: jest.Mocked<ColumnsService>;

  const boardId = '550e8400-e29b-41d4-a716-446655440000';
  const columnId = '660e8400-e29b-41d4-a716-446655440001';

  const mockColumn: BoardColumn = {
    id: columnId,
    name: 'To Do',
    order: 0,
    boardId,
    board: {} as BoardColumn['board'],
    tasks: [],
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnsController],
      providers: [
        {
          provide: ColumnsService,
          useValue: {
            create: jest.fn(),
            findAllByBoard: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            reorder: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    service = module.get(ColumnsService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /columns', () => {
    it('should create a column and return 201', async () => {
      service.create.mockResolvedValue(mockColumn);

      const response = await request(app.getHttpServer())
        .post('/columns')
        .send({ name: 'To Do', boardId })
        .expect(201);

      expect(response.body.name).toBe('To Do');
      expect(response.body.order).toBe(0);
      expect(service.create).toHaveBeenCalled();
    });

    it('should return 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .post('/columns')
        .send({ boardId })
        .expect(400);
    });

    it('should return 400 when name is empty string', async () => {
      await request(app.getHttpServer())
        .post('/columns')
        .send({ name: '', boardId })
        .expect(400);
    });

    it('should return 400 when boardId is missing', async () => {
      await request(app.getHttpServer())
        .post('/columns')
        .send({ name: 'To Do' })
        .expect(400);
    });

    it('should return 400 when boardId is not a UUID', async () => {
      await request(app.getHttpServer())
        .post('/columns')
        .send({ name: 'To Do', boardId: 'not-uuid' })
        .expect(400);
    });

    it('should return 400 when name exceeds 255 characters', async () => {
      await request(app.getHttpServer())
        .post('/columns')
        .send({ name: 'a'.repeat(256), boardId })
        .expect(400);
    });

    it('should return 404 when board does not exist', async () => {
      service.create.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await request(app.getHttpServer())
        .post('/columns')
        .send({ name: 'To Do', boardId })
        .expect(404);
    });
  });

  describe('GET /boards/:boardId/columns', () => {
    it('should return columns sorted by order', async () => {
      const columns = [
        { ...mockColumn, order: 0 },
        { ...mockColumn, id: 'id-2', name: 'Done', order: 1 },
      ];
      service.findAllByBoard.mockResolvedValue(columns);

      const response = await request(app.getHttpServer())
        .get(`/boards/${boardId}/columns`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('To Do');
    });

    it('should return empty array when no columns', async () => {
      service.findAllByBoard.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get(`/boards/${boardId}/columns`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/boards/not-a-uuid/columns')
        .expect(400);
    });

    it('should return 404 when board not found', async () => {
      service.findAllByBoard.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await request(app.getHttpServer())
        .get(`/boards/${boardId}/columns`)
        .expect(404);
    });
  });

  describe('GET /columns/:id', () => {
    it('should return a column by id', async () => {
      service.findOne.mockResolvedValue(mockColumn);

      const response = await request(app.getHttpServer())
        .get(`/columns/${columnId}`)
        .expect(200);

      expect(response.body.id).toBe(columnId);
    });

    it('should return 404 when column not found', async () => {
      service.findOne.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .get(`/columns/${columnId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/columns/not-a-uuid')
        .expect(400);
    });
  });

  describe('PATCH /columns/:id', () => {
    it('should update and return the column', async () => {
      const updated = { ...mockColumn, name: 'In Review' };
      service.update.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch(`/columns/${columnId}`)
        .send({ name: 'In Review' })
        .expect(200);

      expect(response.body.name).toBe('In Review');
    });

    it('should return 404 when column not found', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .patch(`/columns/${columnId}`)
        .send({ name: 'X' })
        .expect(404);
    });

    it('should return 400 when name exceeds 255 characters', async () => {
      await request(app.getHttpServer())
        .patch(`/columns/${columnId}`)
        .send({ name: 'a'.repeat(256) })
        .expect(400);
    });
  });

  describe('DELETE /columns/:id', () => {
    it('should delete and return 200', async () => {
      service.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/columns/${columnId}`)
        .expect(200);

      expect(service.remove).toHaveBeenCalledWith(columnId);
    });

    it('should return 404 when column not found', async () => {
      service.remove.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await request(app.getHttpServer())
        .delete(`/columns/${columnId}`)
        .expect(404);
    });
  });

  describe('PATCH /boards/:boardId/columns/reorder', () => {
    it('should reorder columns and return 200', async () => {
      const idC = '550e8400-e29b-41d4-a716-446655440003';
      const idA = '550e8400-e29b-41d4-a716-446655440004';
      const idB = '550e8400-e29b-41d4-a716-446655440005';
      const reordered = [
        { ...mockColumn, id: idC, order: 0 },
        { ...mockColumn, id: idA, order: 1 },
        { ...mockColumn, id: idB, order: 2 },
      ];
      service.reorder.mockResolvedValue(reordered);

      const response = await request(app.getHttpServer())
        .patch(`/boards/${boardId}/columns/reorder`)
        .send({ columnIds: [idC, idA, idB] })
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].order).toBe(0);
    });

    it('should return 400 when columnIds is empty', async () => {
      await request(app.getHttpServer())
        .patch(`/boards/${boardId}/columns/reorder`)
        .send({ columnIds: [] })
        .expect(400);
    });

    it('should return 400 when columnIds contains non-UUIDs', async () => {
      await request(app.getHttpServer())
        .patch(`/boards/${boardId}/columns/reorder`)
        .send({ columnIds: ['not-a-uuid'] })
        .expect(400);
    });

    it('should return 400 for invalid column IDs', async () => {
      service.reorder.mockRejectedValue(
        new BadRequestException('Invalid column IDs'),
      );

      await request(app.getHttpServer())
        .patch(`/boards/${boardId}/columns/reorder`)
        .send({
          columnIds: [
            '550e8400-e29b-41d4-a716-446655440001',
            '550e8400-e29b-41d4-a716-446655440002',
          ],
        })
        .expect(400);
    });

    it('should return 404 when board not found', async () => {
      service.reorder.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await request(app.getHttpServer())
        .patch(`/boards/${boardId}/columns/reorder`)
        .send({
          columnIds: ['550e8400-e29b-41d4-a716-446655440001'],
        })
        .expect(404);
    });

    it('should return 400 for invalid board UUID', async () => {
      await request(app.getHttpServer())
        .patch('/boards/not-a-uuid/columns/reorder')
        .send({ columnIds: ['550e8400-e29b-41d4-a716-446655440001'] })
        .expect(400);
    });
  });
});

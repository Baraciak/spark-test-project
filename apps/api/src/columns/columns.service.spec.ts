import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { BoardColumn } from './entities/board-column.entity';
import { BoardsService } from '../boards/boards.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

describe('ColumnsService', () => {
  let service: ColumnsService;
  let repository: jest.Mocked<Repository<BoardColumn>>;
  let boardsService: jest.Mocked<BoardsService>;
  let _dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;

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
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsService,
        {
          provide: getRepositoryToken(BoardColumn),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: BoardsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
    repository = module.get(getRepositoryToken(BoardColumn));
    boardsService = module.get(BoardsService);
    _dataSource = module.get(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a column with auto-assigned order (first column = 0)', async () => {
      const dto: CreateColumnDto = { name: 'To Do', boardId };
      const qb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxOrder: null }),
      };
      repository.createQueryBuilder.mockReturnValue(qb as never);
      boardsService.findOne.mockResolvedValue({} as never);
      repository.create.mockReturnValue({ ...mockColumn, order: 0 });
      repository.save.mockResolvedValue({ ...mockColumn, order: 0 });

      const result = await service.create(dto);

      expect(boardsService.findOne).toHaveBeenCalledWith(boardId);
      expect(result.order).toBe(0);
    });

    it('should auto-assign order = max + 1 when columns exist', async () => {
      const dto: CreateColumnDto = { name: 'Done', boardId };
      const qb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxOrder: 2 }),
      };
      repository.createQueryBuilder.mockReturnValue(qb as never);
      boardsService.findOne.mockResolvedValue({} as never);
      repository.create.mockReturnValue({ ...mockColumn, name: 'Done', order: 3 });
      repository.save.mockResolvedValue({ ...mockColumn, name: 'Done', order: 3 });

      const result = await service.create(dto);

      expect(result.order).toBe(3);
    });

    it('should throw NotFoundException when board does not exist', async () => {
      const dto: CreateColumnDto = { name: 'To Do', boardId: 'non-existent' };
      boardsService.findOne.mockRejectedValue(
        new NotFoundException('Board #non-existent not found'),
      );

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByBoard', () => {
    it('should return columns sorted by order ASC', async () => {
      const columns = [
        { ...mockColumn, order: 0 },
        { ...mockColumn, id: 'id-2', name: 'In Progress', order: 1 },
      ];
      boardsService.findOne.mockResolvedValue({} as never);
      repository.find.mockResolvedValue(columns);

      const result = await service.findAllByBoard(boardId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { boardId },
        order: { order: 'ASC' },
      });
      expect(result).toEqual(columns);
    });

    it('should return empty array when board has no columns', async () => {
      boardsService.findOne.mockResolvedValue({} as never);
      repository.find.mockResolvedValue([]);

      const result = await service.findAllByBoard(boardId);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when board does not exist', async () => {
      boardsService.findOne.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await expect(service.findAllByBoard('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a column by id', async () => {
      repository.findOne.mockResolvedValue(mockColumn);

      const result = await service.findOne(columnId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: columnId },
      });
      expect(result).toEqual(mockColumn);
    });

    it('should throw NotFoundException when column not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the column', async () => {
      const dto: UpdateColumnDto = { name: 'In Review' };
      const updatedColumn = { ...mockColumn, name: 'In Review' };
      repository.findOne.mockResolvedValue({ ...mockColumn });
      repository.save.mockResolvedValue(updatedColumn);

      const result = await service.update(columnId, dto);

      expect(result.name).toBe('In Review');
    });

    it('should throw NotFoundException when column not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the column', async () => {
      repository.findOne.mockResolvedValue(mockColumn);
      repository.remove.mockResolvedValue(mockColumn);

      await service.remove(columnId);

      expect(repository.remove).toHaveBeenCalledWith(mockColumn);
    });

    it('should throw NotFoundException when column not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('reorder', () => {
    const colA = { ...mockColumn, id: 'id-a', name: 'A', order: 0 };
    const colB = { ...mockColumn, id: 'id-b', name: 'B', order: 1 };
    const colC = { ...mockColumn, id: 'id-c', name: 'C', order: 2 };

    it('should reorder columns and return them sorted', async () => {
      boardsService.findOne.mockResolvedValue({} as never);
      repository.find
        .mockResolvedValueOnce([colA, colB, colC])
        .mockResolvedValueOnce([
          { ...colC, order: 0 },
          { ...colA, order: 1 },
          { ...colB, order: 2 },
        ]);

      const result = await service.reorder(boardId, ['id-c', 'id-a', 'id-b']);

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.update).toHaveBeenCalledTimes(3);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(result).toHaveLength(3);
    });

    it('should throw BadRequestException for duplicate column IDs', async () => {
      boardsService.findOne.mockResolvedValue({} as never);

      await expect(
        service.reorder(boardId, ['id-a', 'id-a', 'id-b']),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid column IDs', async () => {
      boardsService.findOne.mockResolvedValue({} as never);
      repository.find.mockResolvedValue([colA, colB, colC]);

      await expect(
        service.reorder(boardId, ['id-a', 'id-b', 'foreign-id']),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when not all columns provided', async () => {
      boardsService.findOne.mockResolvedValue({} as never);
      repository.find.mockResolvedValue([colA, colB, colC]);

      await expect(
        service.reorder(boardId, ['id-a', 'id-b']),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when board does not exist', async () => {
      boardsService.findOne.mockRejectedValue(
        new NotFoundException('Board not found'),
      );

      await expect(
        service.reorder('non-existent', ['id-a']),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rollback transaction on error', async () => {
      boardsService.findOne.mockResolvedValue({} as never);
      repository.find.mockResolvedValueOnce([colA, colB]);
      queryRunner.manager.update = jest.fn().mockRejectedValue(new Error('DB error'));

      await expect(
        service.reorder(boardId, ['id-a', 'id-b']),
      ).rejects.toThrow('DB error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});

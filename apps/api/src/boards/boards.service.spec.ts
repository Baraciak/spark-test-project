import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

describe('BoardsService', () => {
  let service: BoardsService;
  let repository: jest.Mocked<Repository<Board>>;

  const mockBoard: Board = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Sprint 1',
    description: 'First sprint',
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: getRepositoryToken(Board),
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

    service = module.get<BoardsService>(BoardsService);
    repository = module.get(getRepositoryToken(Board));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a board', async () => {
      const dto: CreateBoardDto = { name: 'Sprint 1', description: 'First sprint' };
      repository.create.mockReturnValue(mockBoard);
      repository.save.mockResolvedValue(mockBoard);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockBoard);
      expect(result).toEqual(mockBoard);
    });

    it('should create a board without description', async () => {
      const dto: CreateBoardDto = { name: 'Sprint 1' };
      const boardNoDesc = { ...mockBoard, description: null };
      repository.create.mockReturnValue(boardNoDesc);
      repository.save.mockResolvedValue(boardNoDesc);

      const result = await service.create(dto);

      expect(result.description).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return boards sorted by createdAt DESC', async () => {
      const boards = [mockBoard];
      repository.find.mockResolvedValue(boards);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(boards);
    });

    it('should return empty array when no boards exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a board by id', async () => {
      repository.findOne.mockResolvedValue(mockBoard);

      const result = await service.findOne(mockBoard.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockBoard.id },
        relations: ['columns'],
        order: { columns: { order: 'ASC' } },
      });
      expect(result).toEqual(mockBoard);
    });

    it('should throw NotFoundException when board not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the board', async () => {
      const dto: UpdateBoardDto = { name: 'Sprint 2' };
      const updatedBoard = { ...mockBoard, name: 'Sprint 2' };
      repository.findOne.mockResolvedValue({ ...mockBoard });
      repository.save.mockResolvedValue(updatedBoard);

      const result = await service.update(mockBoard.id, dto);

      expect(result.name).toBe('Sprint 2');
    });

    it('should throw NotFoundException when board not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the board', async () => {
      repository.findOne.mockResolvedValue(mockBoard);
      repository.remove.mockResolvedValue(mockBoard);

      await service.remove(mockBoard.id);

      expect(repository.remove).toHaveBeenCalledWith(mockBoard);
    });

    it('should throw NotFoundException when board not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

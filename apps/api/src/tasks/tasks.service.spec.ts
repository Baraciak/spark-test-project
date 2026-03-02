import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { ColumnsService } from '../columns/columns.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<Task>>;
  let columnsService: jest.Mocked<ColumnsService>;
  let queryRunner: jest.Mocked<QueryRunner>;

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
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        createQueryBuilder: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
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
          provide: ColumnsService,
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

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
    columnsService = module.get(ColumnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task with auto-assigned order (first task = 0)', async () => {
      const dto: CreateTaskDto = { title: 'Login page', columnId };
      const qb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxOrder: null }),
      };
      repository.createQueryBuilder.mockReturnValue(qb as never);
      columnsService.findOne.mockResolvedValue({} as never);
      repository.create.mockReturnValue({ ...mockTask, order: 0 });
      repository.save.mockResolvedValue({ ...mockTask, order: 0 });

      const result = await service.create(dto);

      expect(columnsService.findOne).toHaveBeenCalledWith(columnId);
      expect(result.order).toBe(0);
    });

    it('should auto-assign order = max + 1 when tasks exist', async () => {
      const dto: CreateTaskDto = { title: 'Signup page', columnId };
      const qb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxOrder: 2 }),
      };
      repository.createQueryBuilder.mockReturnValue(qb as never);
      columnsService.findOne.mockResolvedValue({} as never);
      repository.create.mockReturnValue({ ...mockTask, title: 'Signup page', order: 3 });
      repository.save.mockResolvedValue({ ...mockTask, title: 'Signup page', order: 3 });

      const result = await service.create(dto);

      expect(result.order).toBe(3);
    });

    it('should create a task with description', async () => {
      const dto: CreateTaskDto = { title: 'Login page', description: 'OAuth flow', columnId };
      const qb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ maxOrder: null }),
      };
      repository.createQueryBuilder.mockReturnValue(qb as never);
      columnsService.findOne.mockResolvedValue({} as never);
      const taskWithDesc = { ...mockTask, description: 'OAuth flow' };
      repository.create.mockReturnValue(taskWithDesc);
      repository.save.mockResolvedValue(taskWithDesc);

      const result = await service.create(dto);

      expect(result.description).toBe('OAuth flow');
    });

    it('should throw NotFoundException when column does not exist', async () => {
      const dto: CreateTaskDto = { title: 'Task', columnId: 'non-existent' };
      columnsService.findOne.mockRejectedValue(
        new NotFoundException('Column #non-existent not found'),
      );

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByColumn', () => {
    it('should return tasks sorted by order ASC', async () => {
      const tasks = [
        { ...mockTask, order: 0 },
        { ...mockTask, id: 'id-2', title: 'Task 2', order: 1 },
      ];
      columnsService.findOne.mockResolvedValue({} as never);
      repository.find.mockResolvedValue(tasks);

      const result = await service.findAllByColumn(columnId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { columnId },
        order: { order: 'ASC' },
      });
      expect(result).toEqual(tasks);
    });

    it('should return empty array when column has no tasks', async () => {
      columnsService.findOne.mockResolvedValue({} as never);
      repository.find.mockResolvedValue([]);

      const result = await service.findAllByColumn(columnId);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when column does not exist', async () => {
      columnsService.findOne.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await expect(service.findAllByColumn('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      repository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(taskId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const dto: UpdateTaskDto = { title: 'New title' };
      const updatedTask = { ...mockTask, title: 'New title' };
      repository.findOne.mockResolvedValue({ ...mockTask });
      repository.save.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, dto);

      expect(result.title).toBe('New title');
    });

    it('should update description', async () => {
      const dto: UpdateTaskDto = { description: 'New desc' };
      const updatedTask = { ...mockTask, description: 'New desc' };
      repository.findOne.mockResolvedValue({ ...mockTask });
      repository.save.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, dto);

      expect(result.description).toBe('New desc');
    });

    it('should throw NotFoundException when task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { title: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the task', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      repository.remove.mockResolvedValue(mockTask);

      await service.remove(taskId);

      expect(repository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('move', () => {
    it('should move task to a different column', async () => {
      const dto: MoveTaskDto = { columnId: columnIdB, order: 0 };
      const movedTask = { ...mockTask, columnId: columnIdB, order: 0 };

      repository.findOne
        .mockResolvedValueOnce(mockTask)       // findOne in move
        .mockResolvedValueOnce(movedTask);     // findOne after commit
      columnsService.findOne.mockResolvedValue({} as never);

      const mockQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };
      const mockCountQb = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      };
      (queryRunner.manager.createQueryBuilder as jest.Mock)
        .mockReturnValueOnce(mockQb)       // close gap in source
        .mockReturnValueOnce(mockCountQb)  // count in target
        .mockReturnValueOnce(mockQb);      // shift in target
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({});

      const result = await service.move(taskId, dto);

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Task, taskId, { columnId: columnIdB, order: 0 },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(result).toEqual(movedTask);
    });

    it('should move task within the same column (down)', async () => {
      const taskAtOrder0 = { ...mockTask, order: 0 };
      const dto: MoveTaskDto = { columnId, order: 2 };
      const movedTask = { ...mockTask, order: 2 };

      repository.findOne
        .mockResolvedValueOnce(taskAtOrder0)
        .mockResolvedValueOnce(movedTask);
      columnsService.findOne.mockResolvedValue({} as never);

      const mockQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };
      const mockCountQb = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(3),
      };
      (queryRunner.manager.createQueryBuilder as jest.Mock)
        .mockReturnValueOnce(mockQb)       // shift tasks
        .mockReturnValueOnce(mockCountQb); // count
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({});

      const result = await service.move(taskId, dto);

      expect(mockQb.execute).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Task, taskId, { order: 2 },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(movedTask);
    });

    it('should move task within the same column (up)', async () => {
      const taskAtOrder2 = { ...mockTask, order: 2 };
      const dto: MoveTaskDto = { columnId, order: 0 };
      const movedTask = { ...mockTask, order: 0 };

      repository.findOne
        .mockResolvedValueOnce(taskAtOrder2)
        .mockResolvedValueOnce(movedTask);
      columnsService.findOne.mockResolvedValue({} as never);

      const mockQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };
      const mockCountQb = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(3),
      };
      (queryRunner.manager.createQueryBuilder as jest.Mock)
        .mockReturnValueOnce(mockQb)       // shift tasks
        .mockReturnValueOnce(mockCountQb); // count
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({});

      const result = await service.move(taskId, dto);

      expect(mockQb.execute).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Task, taskId, { order: 0 },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(movedTask);
    });

    it('should not shift any tasks when moving to same position', async () => {
      const taskAtOrder1 = { ...mockTask, order: 1 };
      const dto: MoveTaskDto = { columnId, order: 1 };

      repository.findOne
        .mockResolvedValueOnce(taskAtOrder1)
        .mockResolvedValueOnce(taskAtOrder1);
      columnsService.findOne.mockResolvedValue({} as never);

      const mockCountQb = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(3),
      };
      (queryRunner.manager.createQueryBuilder as jest.Mock)
        .mockReturnValueOnce(mockCountQb); // only count — no shift QB
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({});

      await service.move(taskId, dto);

      // No shift executed, only final update
      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Task, taskId, { order: 1 },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should clamp order to max when target order exceeds task count (cross-column)', async () => {
      const dto: MoveTaskDto = { columnId: columnIdB, order: 99 };
      const movedTask = { ...mockTask, columnId: columnIdB, order: 2 };

      repository.findOne
        .mockResolvedValueOnce(mockTask)
        .mockResolvedValueOnce(movedTask);
      columnsService.findOne.mockResolvedValue({} as never);

      const mockQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };
      const mockCountQb = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2), // target has 2 tasks
      };
      (queryRunner.manager.createQueryBuilder as jest.Mock)
        .mockReturnValueOnce(mockQb)       // close gap
        .mockReturnValueOnce(mockCountQb)  // count = 2
        .mockReturnValueOnce(mockQb);      // shift
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({});

      await service.move(taskId, dto);

      // order clamped: min(99, 2) = 2
      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Task, taskId, { columnId: columnIdB, order: 2 },
      );
    });

    it('should clamp order to max when target order exceeds task count (same-column)', async () => {
      const taskAtOrder0 = { ...mockTask, order: 0 };
      const dto: MoveTaskDto = { columnId, order: 50 };
      const movedTask = { ...mockTask, order: 2 };

      repository.findOne
        .mockResolvedValueOnce(taskAtOrder0)
        .mockResolvedValueOnce(movedTask);
      columnsService.findOne.mockResolvedValue({} as never);

      const mockQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };
      const mockCountQb = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(3), // 3 tasks → maxOrder = 2
      };
      (queryRunner.manager.createQueryBuilder as jest.Mock)
        .mockReturnValueOnce(mockQb)       // shift
        .mockReturnValueOnce(mockCountQb); // count = 3
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({});

      await service.move(taskId, dto);

      // order clamped: min(50, 3-1) = 2
      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Task, taskId, { order: 2 },
      );
    });

    it('should throw NotFoundException when task not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.move('non-existent', { columnId, order: 0 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when target column not found', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      columnsService.findOne.mockRejectedValue(
        new NotFoundException('Column not found'),
      );

      await expect(
        service.move(taskId, { columnId: 'non-existent', order: 0 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rollback transaction on error', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      columnsService.findOne.mockResolvedValue({} as never);

      const mockQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error('DB error')),
      };
      (queryRunner.manager.createQueryBuilder as jest.Mock)
        .mockReturnValue(mockQb);

      await expect(
        service.move(taskId, { columnId: columnIdB, order: 0 }),
      ).rejects.toThrow('DB error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});

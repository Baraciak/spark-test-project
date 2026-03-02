import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TodosService } from '../src/todos/todos.service';
import { Todo } from '../src/todos/entities/todo.entity';

const mockTodo: Todo = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Test todo',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepository = () => ({
  create: jest.fn().mockReturnValue(mockTodo),
  save: jest.fn().mockResolvedValue(mockTodo),
  find: jest.fn().mockResolvedValue([mockTodo]),
  findOne: jest.fn().mockResolvedValue(mockTodo),
  remove: jest.fn().mockResolvedValue(undefined),
});

describe('TodosService', () => {
  let service: TodosService;
  let repo: jest.Mocked<Repository<Todo>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getRepositoryToken(Todo), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repo = module.get(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const result = await service.create({ title: 'Test todo' });
      expect(repo.create).toHaveBeenCalledWith({ title: 'Test todo' });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return array of todos', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const result = await service.findOne(mockTodo.id);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: mockTodo.id } });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updated = { ...mockTodo, completed: true };
      repo.save.mockResolvedValueOnce(updated);

      const result = await service.update(mockTodo.id, { completed: true });
      expect(result.completed).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      await service.remove(mockTodo.id);
      expect(repo.remove).toHaveBeenCalledWith(mockTodo);
    });
  });
});

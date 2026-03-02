import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { ColumnsService } from '../columns/columns.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly columnsService: ColumnsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    await this.columnsService.findOne(dto.columnId);

    const maxResult = await this.tasksRepository
      .createQueryBuilder('task')
      .select('MAX(task.order)', 'maxOrder')
      .where('task.columnId = :columnId', { columnId: dto.columnId })
      .getRawOne();

    const nextOrder =
      maxResult?.maxOrder != null ? Number(maxResult.maxOrder) + 1 : 0;

    const task = this.tasksRepository.create({
      ...dto,
      order: nextOrder,
    });

    return this.tasksRepository.save(task);
  }

  async findAllByColumn(columnId: string): Promise<Task[]> {
    await this.columnsService.findOne(columnId);

    return this.tasksRepository.find({
      where: { columnId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }

  async move(id: string, dto: MoveTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    await this.columnsService.findOne(dto.columnId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sourceColumnId = task.columnId;
      const targetColumnId = dto.columnId;
      const targetOrder = dto.order;

      if (sourceColumnId === targetColumnId) {
        // Move within the same column
        const currentOrder = task.order;

        if (targetOrder > currentOrder) {
          // Moving down: shift tasks between (current, target] up by -1
          await queryRunner.manager
            .createQueryBuilder()
            .update(Task)
            .set({ order: () => '`order` - 1' })
            .where('columnId = :columnId', { columnId: sourceColumnId })
            .andWhere('`order` > :currentOrder', { currentOrder })
            .andWhere('`order` <= :targetOrder', { targetOrder })
            .execute();
        } else if (targetOrder < currentOrder) {
          // Moving up: shift tasks between [target, current) down by +1
          await queryRunner.manager
            .createQueryBuilder()
            .update(Task)
            .set({ order: () => '`order` + 1' })
            .where('columnId = :columnId', { columnId: sourceColumnId })
            .andWhere('`order` >= :targetOrder', { targetOrder })
            .andWhere('`order` < :currentOrder', { currentOrder })
            .execute();
        }

        // Clamp order to max
        const countResult = await queryRunner.manager
          .createQueryBuilder(Task, 'task')
          .where('task.columnId = :columnId', { columnId: sourceColumnId })
          .getCount();

        const maxOrder = countResult - 1;
        const clampedOrder = Math.min(targetOrder, maxOrder);

        await queryRunner.manager.update(Task, id, { order: clampedOrder });
      } else {
        // Move across columns

        // 1. Close gap in source column
        await queryRunner.manager
          .createQueryBuilder()
          .update(Task)
          .set({ order: () => '`order` - 1' })
          .where('columnId = :columnId', { columnId: sourceColumnId })
          .andWhere('`order` > :taskOrder', { taskOrder: task.order })
          .execute();

        // 2. Count tasks in target to clamp order
        const targetCount = await queryRunner.manager
          .createQueryBuilder(Task, 'task')
          .where('task.columnId = :columnId', { columnId: targetColumnId })
          .getCount();

        const clampedOrder = Math.min(targetOrder, targetCount);

        // 3. Shift tasks in target column at >= clampedOrder
        await queryRunner.manager
          .createQueryBuilder()
          .update(Task)
          .set({ order: () => '`order` + 1' })
          .where('columnId = :columnId', { columnId: targetColumnId })
          .andWhere('`order` >= :clampedOrder', { clampedOrder })
          .execute();

        // 4. Update task with new column and order
        await queryRunner.manager.update(Task, id, {
          columnId: targetColumnId,
          order: clampedOrder,
        });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return this.findOne(id);
  }
}

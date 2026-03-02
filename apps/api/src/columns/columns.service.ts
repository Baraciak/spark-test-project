import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BoardColumn } from './entities/board-column.entity';
import { BoardsService } from '../boards/boards.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly columnsRepository: Repository<BoardColumn>,
    private readonly boardsService: BoardsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateColumnDto): Promise<BoardColumn> {
    await this.boardsService.findOne(dto.boardId);

    const maxResult = await this.columnsRepository
      .createQueryBuilder('col')
      .select('MAX(col.order)', 'maxOrder')
      .where('col.boardId = :boardId', { boardId: dto.boardId })
      .getRawOne();

    const nextOrder =
      maxResult?.maxOrder != null ? Number(maxResult.maxOrder) + 1 : 0;

    const column = this.columnsRepository.create({
      ...dto,
      order: nextOrder,
    });

    return this.columnsRepository.save(column);
  }

  async findAllByBoard(boardId: string): Promise<BoardColumn[]> {
    await this.boardsService.findOne(boardId);

    return this.columnsRepository.find({
      where: { boardId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<BoardColumn> {
    const column = await this.columnsRepository.findOne({ where: { id } });
    if (!column) {
      throw new NotFoundException(`Column #${id} not found`);
    }
    return column;
  }

  async update(id: string, dto: UpdateColumnDto): Promise<BoardColumn> {
    const column = await this.findOne(id);
    Object.assign(column, dto);
    return this.columnsRepository.save(column);
  }

  async remove(id: string): Promise<void> {
    const column = await this.findOne(id);
    await this.columnsRepository.remove(column);
  }

  async reorder(
    boardId: string,
    columnIds: string[],
  ): Promise<BoardColumn[]> {
    await this.boardsService.findOne(boardId);

    const uniqueIds = new Set(columnIds);
    if (uniqueIds.size !== columnIds.length) {
      throw new BadRequestException('Duplicate column IDs');
    }

    const boardColumns = await this.columnsRepository.find({
      where: { boardId },
    });

    const boardColumnIds = new Set(boardColumns.map((c) => c.id));

    if (uniqueIds.size !== boardColumnIds.size) {
      throw new BadRequestException('All column IDs must be provided');
    }

    for (const id of columnIds) {
      if (!boardColumnIds.has(id)) {
        throw new BadRequestException('Invalid column IDs');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < columnIds.length; i++) {
        await queryRunner.manager.update(BoardColumn, columnIds[i], {
          order: i,
        });
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return this.columnsRepository.find({
      where: { boardId },
      order: { order: 'ASC' },
    });
  }
}

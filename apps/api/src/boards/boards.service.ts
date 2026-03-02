import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
  ) {}

  create(dto: CreateBoardDto): Promise<Board> {
    const board = this.boardsRepository.create(dto);
    return this.boardsRepository.save(board);
  }

  findAll(): Promise<Board[]> {
    return this.boardsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardsRepository.findOne({ where: { id } });
    if (!board) {
      throw new NotFoundException(`Board #${id} not found`);
    }
    return board;
  }

  async update(id: string, dto: UpdateBoardDto): Promise<Board> {
    const board = await this.findOne(id);
    Object.assign(board, dto);
    return this.boardsRepository.save(board);
  }

  async remove(id: string): Promise<void> {
    const board = await this.findOne(id);
    await this.boardsRepository.remove(board);
  }
}

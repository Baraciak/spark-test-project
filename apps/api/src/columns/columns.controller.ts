import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { BoardColumn } from './entities/board-column.entity';

@ApiTags('columns')
@Controller()
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post('columns')
  @ApiOperation({ summary: 'Create a new column in a board' })
  @ApiResponse({ status: 201, description: 'Column created', type: BoardColumn })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  create(@Body() dto: CreateColumnDto): Promise<BoardColumn> {
    return this.columnsService.create(dto);
  }

  @Get('boards/:boardId/columns')
  @ApiOperation({ summary: 'Get all columns for a board' })
  @ApiResponse({
    status: 200,
    description: 'List of columns sorted by order',
    type: [BoardColumn],
  })
  @ApiResponse({ status: 404, description: 'Board not found' })
  findAllByBoard(
    @Param('boardId', ParseUUIDPipe) boardId: string,
  ): Promise<BoardColumn[]> {
    return this.columnsService.findAllByBoard(boardId);
  }

  @Get('columns/:id')
  @ApiOperation({ summary: 'Get a single column' })
  @ApiResponse({ status: 200, description: 'The column', type: BoardColumn })
  @ApiResponse({ status: 404, description: 'Column not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BoardColumn> {
    return this.columnsService.findOne(id);
  }

  @Patch('columns/:id')
  @ApiOperation({ summary: 'Update a column' })
  @ApiResponse({ status: 200, description: 'Column updated', type: BoardColumn })
  @ApiResponse({ status: 404, description: 'Column not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateColumnDto,
  ): Promise<BoardColumn> {
    return this.columnsService.update(id, dto);
  }

  @Delete('columns/:id')
  @ApiOperation({ summary: 'Delete a column' })
  @ApiResponse({ status: 200, description: 'Column deleted' })
  @ApiResponse({ status: 404, description: 'Column not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.columnsService.remove(id);
  }

  @Patch('boards/:boardId/columns/reorder')
  @ApiOperation({ summary: 'Reorder columns within a board' })
  @ApiResponse({
    status: 200,
    description: 'Columns reordered',
    type: [BoardColumn],
  })
  @ApiResponse({ status: 400, description: 'Invalid column IDs' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  reorder(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: ReorderColumnsDto,
  ): Promise<BoardColumn[]> {
    return this.columnsService.reorder(boardId, dto.columnIds);
  }
}

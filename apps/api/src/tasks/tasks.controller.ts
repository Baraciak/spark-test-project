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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('tasks')
  @ApiOperation({ summary: 'Create a new task in a column' })
  @ApiResponse({ status: 201, description: 'Task created', type: Task })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Column not found' })
  create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }

  @Get('columns/:columnId/tasks')
  @ApiOperation({ summary: 'Get all tasks for a column' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks sorted by order',
    type: [Task],
  })
  @ApiResponse({ status: 404, description: 'Column not found' })
  findAllByColumn(
    @Param('columnId', ParseUUIDPipe) columnId: string,
  ): Promise<Task[]> {
    return this.tasksService.findAllByColumn(columnId);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get a single task' })
  @ApiResponse({ status: 200, description: 'The task', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Patch('tasks/:id/move')
  @ApiOperation({ summary: 'Move a task to a different position or column' })
  @ApiResponse({ status: 200, description: 'Task moved', type: Task })
  @ApiResponse({ status: 404, description: 'Task or column not found' })
  move(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MoveTaskDto,
  ): Promise<Task> {
    return this.tasksService.move(id, dto);
  }
}

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
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created', type: Todo })
  create(@Body() dto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'List of todos', type: [Todo] })
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single todo' })
  @ApiResponse({ status: 200, description: 'The todo', type: Todo })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated', type: Todo })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 200, description: 'Todo deleted' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.todosService.remove(id);
  }
}

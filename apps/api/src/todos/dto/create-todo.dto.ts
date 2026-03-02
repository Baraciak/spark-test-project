import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries', description: 'The todo title' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

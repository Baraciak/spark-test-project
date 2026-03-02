import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ example: 'To Do', description: 'Column name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Board ID this column belongs to',
  })
  @IsUUID()
  boardId: string;
}

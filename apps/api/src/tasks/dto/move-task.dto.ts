import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class MoveTaskDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Target column ID',
  })
  @IsUUID()
  columnId: string;

  @ApiProperty({
    example: 0,
    description: 'Target position (order) in the column',
  })
  @IsInt()
  @Min(0)
  order: number;
}

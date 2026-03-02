import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ReorderColumnsDto {
  @ApiProperty({
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    description: 'Ordered array of all column IDs for the board',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  columnIds: string[];
}

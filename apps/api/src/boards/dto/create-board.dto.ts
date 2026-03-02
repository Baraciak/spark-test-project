import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Sprint 1', description: 'The board name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'First sprint board',
    description: 'Optional board description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

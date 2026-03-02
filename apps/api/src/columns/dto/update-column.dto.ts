import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateColumnDto {
  @ApiPropertyOptional({ example: 'In Review' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;
}

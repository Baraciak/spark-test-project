import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiPropertyOptional({ example: 'Buy organic groceries' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // Transformar
  @Type(() => Number)
  limit?: number;
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;
  @IsOptional()
  @IsString()
  search?: string;
}

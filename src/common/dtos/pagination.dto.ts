import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 5,
    required: false,
    default: 10,
    description: 'How many items do you want to show',
  })
  @IsOptional()
  @IsPositive()
  // Transformar
  @Type(() => Number)
  limit?: number;
  @ApiProperty({
    example: 1,
    required: false,
    default: 1,
    description: 'What page are you on?',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;
  @ApiProperty({
    example: 'hola',
    required: false,
    description: 'Search by name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

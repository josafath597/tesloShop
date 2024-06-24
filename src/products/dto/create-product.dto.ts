import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(5)
  title: string;
  @ApiProperty({
    example: 29.99,
    description: 'Product price',
    nullable: false,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
  @ApiProperty({
    example: 'This is a description of the product',
    description: 'Product description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({
    example: 't-shirt_teslo',
    description: 'Product slug -  for SEO',
    uniqueItems: true,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;
  @ApiProperty({
    example: 10,
    description: 'Product stock',
    nullable: true,
    minimum: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;
  @ApiProperty({
    example: ['M', 'L', 'XL'],
    description: 'Product sizes',
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];
  @ApiProperty({
    example: 'men',
    description: 'Product gender',
    nullable: false,
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
  @ApiProperty({
    example: ['shirt', 't-shirt'],
    description: 'Product tags',
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];
  @ApiProperty({
    example: ['https://image1.com', 'https://image2.com'],
    description: 'Product images',
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

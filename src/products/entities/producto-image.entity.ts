import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImagen {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    example: 'http://product-image.jpg',
    description: 'Product image URL',
    uniqueItems: true,
  })
  @Column('text')
  url: string;
  @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
  product: Product;
}

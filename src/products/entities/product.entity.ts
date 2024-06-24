import { User } from '@app/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImagen } from './producto-image.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;
  @ApiProperty({
    example: 29.99,
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;
  @ApiProperty({
    example: 'This is a description of the product',
    description: 'Product description',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion: string;
  @ApiProperty({
    example: 't-shirt_teslo',
    description: 'Product slug -  for SEO',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;
  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;
  @ApiProperty({
    example: ['M', 'L', 'XL'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];
  @ApiProperty({
    example: 'men',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;
  @ApiProperty({
    example: ['shirt', 't-shirt'],
    description: 'Product tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];
  @ApiProperty({
    example: ['https://image1.com', 'https://image2.com'],
    description: 'Product images',
  })
  @OneToMany(() => ProductImagen, productImage => productImage.product, { cascade: true, eager: true })
  images?: ProductImagen[];

  @ManyToOne(() => User, user => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }
  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }
}

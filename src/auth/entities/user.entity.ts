import { Product } from '@app/products/entities';
import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    example: 'test@test.com',
    description: 'User email',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  email: string;
  @ApiProperty({
    example: '123456789',
    description: 'User password',
  })
  @Column('text', { select: false })
  password: string;
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  @Column('text')
  fullName: string;
  @ApiProperty({
    example: true,
    description: 'User status',
  })
  @Column('bool', { default: true })
  isActive: boolean;
  @ApiProperty({
    example: ['user', 'admin'],
    description: 'User roles',
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @OneToMany(() => Product, product => product.user)
  product: Product;

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}

import { User } from '@app/auth/entities/user.entity';
import { PaginationDto } from '@app/common/dtos/pagination.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImagen } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImagen)
    private readonly productImageRepository: Repository<ProductImagen>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const producto = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user,
      });
      await this.productRepository.save(producto);
      return producto;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // TODO: paginar
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1, search = '' } = paginationDto;
    const skip = (page - 1) * limit;

    // const [products, total] = await this.productRepository.findAndCount({
    //   where: {
    //     title: Raw(alias => `${alias} ILIKE '%${search}%'`),
    //   },
    //   take: limit,
    //   skip,
    //   relations: {
    //     images: true,
    //   },
    // });

    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .where('product.title ILIKE :search', { search: `%${search}%` })
      .take(limit)
      .skip(skip)
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.user', 'user');
    const [products, total] = await queryBuilder.getManyAndCount();
    return {
      products: products.map(product => ({ ...product, images: product.images.map(img => img.url) })),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(term: string) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    if (isUUID(term)) {
      queryBuilder.where('product.id = :id', { id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      queryBuilder.where('UPPER(product.title) = :title OR product.slug = :slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      });
    }

    // Añadir uniones para cargar imágenes y usuario
    queryBuilder.leftJoinAndSelect('product.images', 'images');
    queryBuilder.leftJoinAndSelect('product.user', 'user');
    // Ejecutar la consulta
    const product = await queryBuilder.getOne();
    if (!product) {
      throw new NotFoundException(`Product with id: ${term} not found`);
    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) throw new NotFoundException(`Product with id: ${id} not found`);

    // Create query runner

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImagen, { product: { id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      }
      product.user = user;

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return `Se elimino con existo el registro #${id}`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}

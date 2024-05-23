import { ProductsService } from '@app/products/products.service';
import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}
  async runSeed() {
    await this.insertNewProducts();
    return 'Seed executed';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    const product = initialData.products;
    const insertPromises = [];
    product.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    });
    await Promise.all(insertPromises);
    return true;
  }
}

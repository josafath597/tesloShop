import { AuthModule } from '@app/auth/auth.module';
import { ProductsModule } from '@app/products/products.module';
import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, AuthModule],
})
export class SeedModule {}

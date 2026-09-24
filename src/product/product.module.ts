import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { FindOneProvider } from './providers/find-one.provider';
import { FindAllProvider } from './providers/find-all.provider';
import { CreateProvider } from './providers/create.provider';
import { UpdateProvider } from './providers/update.provider';
import { DeleteProvider } from './providers/delete.provider';
import { ProductCacheService } from './services/product-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    FindOneProvider,
    FindAllProvider,
    CreateProvider,
    UpdateProvider,
    DeleteProvider,
    ProductCacheService,
  ],
})
export class ProductModule {}

import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from './entity/cart.entity';
import { AddItemProvider } from './providers/add-item.provider';
import { ClearCartProvider } from './providers/clear.provider';
import { RemoveItemProvider } from './providers/delete.provider';
import { GetCartProvider } from './providers/get.provider';
import { UpdateItemProvider } from './providers/update.provider';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Cart]), ProductModule],
  controllers: [CartController],
  providers: [
    AddItemProvider,
    ClearCartProvider,
    RemoveItemProvider,
    GetCartProvider,
    UpdateItemProvider,
  ],
})
export class CartModule {}

import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from './entity/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Cart])],
  controllers: [CartController],
  providers: [],
})
export class CartModule {}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Cart } from './cart.entity';
import { Product } from '../../product/entity/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'cart_id',
  })
  cart: Cart;

  @ManyToOne(() => Product, {
    nullable: false,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;
}

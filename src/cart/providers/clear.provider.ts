import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entity/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../entity/cart-item.entity';

@Injectable()
export class ClearCartProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  public async clear(userId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    await this.cartItemRepository.delete({
      cart: {
        id: cart.id,
      },
    });
  }
}

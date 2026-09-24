import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../entity/cart-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RemoveItemProvider {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  public async remove(cartItemId: string, userId: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id: cartItemId,
        cart: {
          user: {
            id: userId,
          },
        },
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.cartItemRepository.remove(cartItem);
  }
}

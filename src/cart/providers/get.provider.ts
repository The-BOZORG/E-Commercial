import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entity/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetCartProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  public async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    return cart;
  }
}

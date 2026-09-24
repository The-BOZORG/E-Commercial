import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../entity/cart-item.entity';
import { Repository } from 'typeorm';
import { UpdateCartItemDto } from '../dto/cart-update.dto';

@Injectable()
export class UpdateItemProvider {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  public async update(
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
    userId: string,
  ): Promise<CartItem> {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id: cartItemId,
        cart: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        product: true,
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    if (!cartItem.product.isActive)
      throw new BadRequestException('Product is not active');

    if (quantity > cartItem.product.stock)
      throw new BadRequestException('Not enough stock');

    cartItem.quantity = quantity;

    return this.cartItemRepository.save(cartItem);
  }
}

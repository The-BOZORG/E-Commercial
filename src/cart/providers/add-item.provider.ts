import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entity/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../entity/cart-item.entity';
import { Product } from 'src/product/entity/product.entity';
import { AddCartItemDto } from '../dto/cart-item.dto';

@Injectable()
export class AddItemProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async addItem(
    addCartItemDto: AddCartItemDto,
    userId: string,
  ): Promise<CartItem> {
    const { productId, quantity } = addCartItemDto;

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (!product.isActive)
      throw new BadRequestException('Product is not active');

    if (product.stock < quantity)
      throw new BadRequestException('Not enough stock');

    let cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: {
          id: userId,
        },
      });

      await this.cartRepository.save(cart);
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: {
          id: cart.id,
        },
        product: {
          id: productId,
        },
      },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > product.stock)
        throw new BadRequestException('Not enough stock');

      cartItem.quantity = newQuantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart: {
          id: cart.id,
        },
        product: {
          id: productId,
        },
        quantity,
      });
    }

    return this.cartItemRepository.save(cartItem);
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async delete(productId: string, userId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.createdBy.id !== userId)
      throw new ForbiddenException('You cannot delete this product');

    await this.productRepository.remove(product);
  }
}

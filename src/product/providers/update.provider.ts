import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from '../dto/update.dto';
import { ProductCacheService } from '../services/product-cache.service';

@Injectable()
export class UpdateProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly productCacheService: ProductCacheService,
  ) {}

  public async update(
    productId: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,

        createdBy: {
          id: userId,
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.createdBy.id !== userId)
      throw new ForbiddenException('You cannot update this product');

    Object.assign(product, updateProductDto);

    await this.productCacheService.deleteProduct(productId);

    return this.productRepository.save(product);
  }
}

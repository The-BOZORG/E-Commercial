import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { ProductCacheService } from '../services/product-cache.service';

@Injectable()
export class FindOneProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly productCacheService: ProductCacheService,
  ) {}

  public async findOne(productId: string): Promise<Product> {
    const cachedProduct = await this.productCacheService.getProduct(productId);

    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    await this.productCacheService.setProduct(product);

    return product;
  }
}

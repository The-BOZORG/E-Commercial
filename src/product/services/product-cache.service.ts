import { Injectable } from '@nestjs/common';

import { RedisService } from 'src/redis/redis.service';
import { Product } from '../entity/product.entity';

@Injectable()
export class ProductCacheService {
  private readonly productExpiration = 60 * 10; // 10 minutes

  constructor(private readonly redisService: RedisService) {}

  async getProduct(productId: string): Promise<Product | null> {
    const data = await this.redisService
      .getClient()
      .get(`product:${productId}`);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as Product;
  }

  async setProduct(product: Product): Promise<void> {
    await this.redisService
      .getClient()
      .set(`product:${product.id}`, JSON.stringify(product), {
        EX: this.productExpiration,
      });
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.redisService.getClient().del(`product:${productId}`);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from '../dto/update.dto';

@Injectable()
export class UpdateProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async update(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }
}

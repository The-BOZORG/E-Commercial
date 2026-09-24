import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async findOne(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
}

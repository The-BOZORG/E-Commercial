import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create.dto';

@Injectable()
export class CreateProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      createdBy: {
        id: userId,
      },
    });

    return this.productRepository.save(product);
  }
}

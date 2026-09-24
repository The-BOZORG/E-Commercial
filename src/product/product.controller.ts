import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { FindOneProvider } from './providers/find-one.provider';
import { GetProductsDto } from './dto/get-product.dto';
import { FindAllProvider } from './providers/find-all.provider';

@Controller('product')
export class ProductsController {
  constructor(
    private readonly findOneProvider: FindOneProvider,
    private readonly findAllProvider: FindAllProvider,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.findOneProvider.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: GetProductsDto) {
    return this.findAllProvider.findAll(query);
  }
}

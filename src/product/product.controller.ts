import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindOneProvider } from './providers/find-one.provider';
import { GetProductsDto } from './dto/get-product.dto';
import { FindAllProvider } from './providers/find-all.provider';
import { CreateProductDto } from './dto/create.dto';
import { CreateProvider } from './providers/create.provider';
import { Authorized } from 'src/shared/decorator/authorized.decorator';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorator/role.decorator';
import { UserRole } from 'src/auth/enum/enum.auth';

@Controller('product')
export class ProductsController {
  constructor(
    private readonly findOneProvider: FindOneProvider,
    private readonly findAllProvider: FindAllProvider,
    private readonly createProvider: CreateProvider,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.findOneProvider.findOne(id);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: GetProductsDto) {
    return this.findAllProvider.findAll(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() createProductDto: CreateProductDto,
    @Authorized('userId') userId: string,
  ) {
    return this.createProvider.create(createProductDto, userId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { UpdateProductDto } from './dto/update.dto';
import { UpdateProvider } from './providers/update.provider';
import { DeleteProvider } from './providers/delete.provider';

@Controller('product')
export class ProductsController {
  constructor(
    private readonly findOneProvider: FindOneProvider,
    private readonly findAllProvider: FindAllProvider,
    private readonly createProvider: CreateProvider,
    private readonly updateProvider: UpdateProvider,
    private readonly deleteProvider: DeleteProvider,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') productId: string) {
    return this.findOneProvider.findOne(productId);
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

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.updateProvider.update(productId, updateProductDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') productId: string, @Authorized('userId') userId: string) {
    return this.deleteProvider.delete(productId, userId);
  }
}

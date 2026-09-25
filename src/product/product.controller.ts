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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
@ApiTags('Products')
export class ProductsController {
  constructor(
    private readonly findOneProvider: FindOneProvider,
    private readonly findAllProvider: FindAllProvider,
    private readonly createProvider: CreateProvider,
    private readonly updateProvider: UpdateProvider,
    private readonly deleteProvider: DeleteProvider,
  ) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products with pagination (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of products.' })
  findAll(@Query() query: GetProductsDto) {
    return this.findAllProvider.findAll(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully.',
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @Authorized('userId') userId: string,
  ) {
    return this.createProvider.create(createProductDto, userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product found.' })
  findOne(@Param('id') productId: string) {
    return this.findOneProvider.findOne(productId);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully.',
  })
  update(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @Authorized('userId') userId: string,
  ) {
    return this.updateProvider.update(productId, updateProductDto, userId);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product deleted successfully.',
  })
  delete(@Param('id') productId: string, @Authorized('userId') userId: string) {
    return this.deleteProvider.delete(productId, userId);
  }
}

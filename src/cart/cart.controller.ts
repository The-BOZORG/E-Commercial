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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddCartItemDto } from './dto/cart-item.dto';
import { Authorized } from 'src/shared/decorator/authorized.decorator';
import { AddItemProvider } from './providers/add-item.provider';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { GetCartProvider } from './providers/get.provider';
import { UpdateCartItemDto } from './dto/cart-update.dto';
import { UpdateItemProvider } from './providers/update.provider';
import { RemoveItemProvider } from './providers/delete.provider';
import { ClearCartProvider } from './providers/clear.provider';

@Controller('cart')
@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly addItemProvider: AddItemProvider,
    private readonly getCartProvider: GetCartProvider,
    private readonly updateItemProvider: UpdateItemProvider,
    private readonly removeItemProvider: RemoveItemProvider,
    private readonly clearCartProvider: ClearCartProvider,
  ) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cart fetched successfully.',
  })
  getCart(@Authorized('userId') userId: string) {
    return this.getCartProvider.getCart(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddCartItemDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Item added to cart.',
  })
  addItem(
    @Body() addCartItemDto: AddCartItemDto,
    @Authorized('userId') userId: string,
  ) {
    return this.addItemProvider.addItem(addCartItemDto, userId);
  }

  @Patch('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update quantity for a cart item' })
  @ApiParam({ name: 'id', type: String, description: 'Cart item ID' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cart item updated successfully.',
  })
  updateItem(
    @Param('id') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Authorized('userId') userId: string,
  ) {
    return this.updateItemProvider.update(
      cartItemId,
      updateCartItemDto,
      userId,
    );
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an item from cart' })
  @ApiParam({ name: 'id', type: String, description: 'Cart item ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Item removed from cart.',
  })
  removeItem(
    @Param('id') cartItemId: string,
    @Authorized('userId') userId: string,
  ) {
    return this.removeItemProvider.remove(cartItemId, userId);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear all items from current cart' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cart cleared successfully.',
  })
  clear(@Authorized('userId') userId: string) {
    return this.clearCartProvider.clear(userId);
  }
}

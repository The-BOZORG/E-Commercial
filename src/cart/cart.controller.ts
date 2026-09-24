import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddCartItemDto } from './dto/cart-item.dto';
import { Authorized } from 'src/shared/decorator/authorized.decorator';
import { AddItemProvider } from './providers/add-item.provider';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly addItemProvider: AddItemProvider) {}

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  addItem(
    @Body() addCartItemDto: AddCartItemDto,
    @Authorized('userId') userId: string,
  ) {
    return this.addItemProvider.addItem(addCartItemDto, userId);
  }
}

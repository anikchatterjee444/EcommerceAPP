import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  addItem(@Req() req: Request, @Body() dto: AddCartItemDto) {
    const { userId } = req.user as JwtPayload;
    return this.cartService.addItem(userId, dto);
  }

  @Patch('items/:productId')
  @UseGuards(JwtAuthGuard)
  updateItem(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    const { userId } = req.user as JwtPayload;
    return this.cartService.updateItem(userId, productId, dto);
  }

  @Delete('items/:productId')
  @UseGuards(JwtAuthGuard)
  removeItem(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const { userId } = req.user as JwtPayload;
    return this.cartService.removeItem(userId, productId);
  }
}

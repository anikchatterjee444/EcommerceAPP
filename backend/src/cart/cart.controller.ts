import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  addItem(@Req() req: Request, @Body() dto: AddCartItemDto) {
    const userId = (req.user as any).userId;
    return this.cartService.addItem(userId, dto);
  }
}

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    return this.ordersService.checkout(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    return this.ordersService.findAllByUser(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const { userId } = req.user as JwtPayload;
    return this.ordersService.findOneByUser(userId, id);
  }
}

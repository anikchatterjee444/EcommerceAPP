import {
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req: Request) {
        const userId = (req.user as any).userId;
        return this.ordersService.findAllByUser(userId);
    }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    checkout(@Req() req: Request) {
        const userId = (req.user as any).userId;
        return this.ordersService.checkout(userId);
    }
}
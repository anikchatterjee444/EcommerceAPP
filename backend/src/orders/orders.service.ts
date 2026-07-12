import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllByUser(userId: number) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    select: {
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                id: true,
                                title: true,
                                thumbnail: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async checkout(userId: number) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        );

        return await this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: 'PENDING',
                },
            });

            await tx.orderItem.createMany({
                data: cart.items.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
            });

            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });

            await tx.cart.delete({
                where: {
                    id: cart.id,
                },
            });

            const createdOrder = await tx.order.findUnique({
                where: {
                    id: order.id,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            return createdOrder;
        });
    }

}

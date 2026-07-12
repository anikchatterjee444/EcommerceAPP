import { Test } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const prismaMock = {
    $transaction: jest.fn((cb) => cb(prismaMock)),
    cart: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
    product: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(OrdersService);
    jest.clearAllMocks();
  });

  it('should checkout successfully when stock is sufficient', async () => {
    const mockCart = {
      id: 1,
      userId: 42,
      items: [
        {
          id: 10,
          cartId: 1,
          productId: 101,
          quantity: 2,
          product: {
            id: 101,
            title: 'Cool Product',
            price: 50,
            stock: 5,
          },
        },
      ],
    };

    const mockOrder = {
      id: 500,
      userId: 42,
      totalAmount: 100,
      status: 'PENDING',
      items: [
        {
          id: 1001,
          orderId: 500,
          productId: 101,
          quantity: 2,
          price: 50,
        },
      ],
    };

    prismaMock.cart.findUnique.mockResolvedValue(mockCart);
    prismaMock.order.create.mockResolvedValue(mockOrder);
    prismaMock.product.update.mockResolvedValue({});
    prismaMock.cart.delete.mockResolvedValue({});

    const result = await service.checkout(42);

    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: 42 },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: {
        userId: 42,
        totalAmount: 100,
        items: {
          create: [
            {
              productId: 101,
              quantity: 2,
              price: 50,
            },
          ],
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 101 },
      data: {
        stock: {
          decrement: 2,
        },
      },
    });

    expect(prismaMock.cart.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException if cart does not exist', async () => {
    prismaMock.cart.findUnique.mockResolvedValue(null);

    await expect(service.checkout(42)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if cart is empty', async () => {
    prismaMock.cart.findUnique.mockResolvedValue({
      id: 1,
      userId: 42,
      items: [],
    });

    await expect(service.checkout(42)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if stock is insufficient', async () => {
    const mockCart = {
      id: 1,
      userId: 42,
      items: [
        {
          id: 10,
          cartId: 1,
          productId: 101,
          quantity: 10,
          product: {
            id: 101,
            title: 'Cool Product',
            price: 50,
            stock: 5,
          },
        },
      ],
    };

    prismaMock.cart.findUnique.mockResolvedValue(mockCart);

    await expect(service.checkout(42)).rejects.toThrow(BadRequestException);
    expect(prismaMock.order.create).not.toHaveBeenCalled();
    expect(prismaMock.product.update).not.toHaveBeenCalled();
  });
});

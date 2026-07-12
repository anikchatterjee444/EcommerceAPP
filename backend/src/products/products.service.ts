import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importProducts(): Promise<void> {
    this.logger.log('Fetching products from DummyJSON...');

    const response = await fetch('https://dummyjson.com/products?limit=0');

    if (!response.ok) {
      throw new Error('Failed to fetch products from DummyJSON');
    }

    const data = await response.json();
    const products = data.products;

    this.logger.log(`Found ${products.length} products.`);

    let imported = 0;
    let skipped = 0;

    for (const product of products) {
      const exists = await this.prisma.product.findUnique({
        where: {
          dummyJsonId: product.id,
        },
      });

      if (exists) {
        skipped++;
        continue;
      }

      await this.prisma.product.create({
        data: {
          dummyJsonId: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand,
          sku: product.sku,
          price: product.price,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          weight: product.weight,
          warrantyInformation: product.warrantyInformation,
          shippingInformation: product.shippingInformation,
          availabilityStatus: product.availabilityStatus,
          returnPolicy: product.returnPolicy,
          minimumOrderQuantity: product.minimumOrderQuantity,
          thumbnail: product.thumbnail,
          images: product.images,
          tags: product.tags,
        },
      });

      imported++;
    }

    this.logger.log(`Imported: ${imported}`);
    this.logger.log(`Skipped: ${skipped}`);
  }

  async findAll(query: GetProductsDto) {
    const {
      page = 1,
      limit = 10,
      q,
      category,
      minPrice,
      maxPrice,
      sort = 'id',
      order = 'asc',
    } = query;

    const where: Prisma.ProductWhereInput = {};

    if (q) {
      where.OR = [
        {
          title: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          brand: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    const skip = (page - 1) * limit;

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort]: order,
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}

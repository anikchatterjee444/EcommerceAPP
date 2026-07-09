import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(private readonly prisma: PrismaService) { }

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

    async findAll() {
        return this.prisma.product.findMany({
            orderBy: {
                id: 'asc',
            },
        });
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

    async search(query: string) {
        return this.prisma.product.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        brand: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    async findByCategory(category: string) {
        return this.prisma.product.findMany({
            where: {
                category: {
                    equals: category,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }
}
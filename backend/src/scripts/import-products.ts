import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const productsService = app.get(ProductsService);

        await productsService.importProducts();

        console.log('✅ Product import completed.');
    } catch (error) {
        console.error('❌ Product import failed:', error);
    } finally {
        await app.close();
    }
}

bootstrap();
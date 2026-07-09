import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    async importProducts(): Promise<void> {
        console.log('🚀 Product import started...');
    }
}
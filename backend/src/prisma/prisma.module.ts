import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global so every feature module (Users, Auth, Products, ...)
// can inject PrismaService without re-importing PrismaModule.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

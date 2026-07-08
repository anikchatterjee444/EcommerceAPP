import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService is the ONLY class in the app that is allowed to
 * talk to PostgreSQL. Every other module goes through a service
 * (e.g. UsersService) that injects PrismaService — nothing else
 * imports PrismaClient directly.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

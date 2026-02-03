import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    console.log("Connect Database");
    await this.$connect();
  }

  async onModuleDestroy() {
    console.log("Disconnect Database");
    await this.$disconnect();
  }
}

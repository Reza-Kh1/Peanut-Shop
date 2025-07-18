import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModules } from './common/config/config.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModules, PrismaModule, UserModule, AuthModule],
  // controllers: [AppController],
})
export class AppModule {}

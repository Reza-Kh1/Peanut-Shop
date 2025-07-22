import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SetCookie } from 'src/auth/provider/set.cookie';
import { AccessTokenGuard } from './guard/access-token.guard';
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),

        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SetCookie],
  exports: [JwtModule]
})
export class AuthModule { }

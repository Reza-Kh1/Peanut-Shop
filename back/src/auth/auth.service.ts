import { Injectable, UnauthorizedException } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/common/utils/hash.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostUserDto } from 'src/user/dtos/post.user.dto';
import { AuthEntities } from './entities/user.entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async register(body: PostUserDto): Promise<AuthEntities> {
    if (!await this.findByEmail(body.email)) {
      const userCreate = await this.prisma.user.create({
        data: {
          email: body.email,
          name: body.username,
          googleId: body.googleId,
          password: body.password ? await hashPassword(body.password) : null,
        },
      });
      return {
        createdAt: userCreate.createdAt,
        googleId: userCreate.googleId || '',
        phone: userCreate.phone || '',
        role: userCreate.role,
        email: userCreate.email,
        name: userCreate.name,
        id: userCreate.id,
      }
    } else {
      throw new UnauthorizedException('کاربر قبلا باایمیل ارسال شده ثبت نام کرده است.');
    }
  }

  async login(body: PostUserDto): Promise<AuthEntities> {
    const findUser = await this.findByEmail(body.email)
    if (findUser && body.password && findUser.password) {
      await comparePassword(body.password, findUser.password);
      return {
        createdAt: findUser.createdAt,
        googleId: findUser.googleId || '',
        phone: findUser.phone || '',
        role: findUser.role,
        email: findUser.email,
        name: findUser.name,
        id: findUser.id,
      }
    } else {
      throw new UnauthorizedException('کاربری با این ایمیل ثبت نام نکرده است.');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (_err) {
      return null;
    }
  }

}

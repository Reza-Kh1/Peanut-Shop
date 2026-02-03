import { ConflictException, Injectable } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/common/utils/hash.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntities } from './entities/auth.entities';
import { LoginDto } from './dto/auth.dto';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async register(body: LoginDto): Promise<AuthEntities> {
    const firstUser = await this.prisma.user.count()
    if (!await this.findByEmail(body.email)) {
      const userCreate = await this.prisma.user.create({
        data: {
          role: firstUser ? 'USER' : 'ADMIN',
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
      throw new ConflictException('کاربر قبلا باایمیل ارسال شده ثبت نام کرده است.');
    }
  }

  async login(body: LoginDto): Promise<AuthEntities> {
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
      throw new ConflictException('کاربری با این ایمیل ثبت نام نکرده است.');
    }
  }

  async logOut(res: Response, req: Request) {
    const cookies = req.cookies as Record<string, string>;
    if (!cookies?.access_token && !cookies?.refresh_token) {
      return { success: true }
    }
    try {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return { success: true }
    } catch (err) {
      throw new ConflictException('دوباره تلاش کنید.');
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

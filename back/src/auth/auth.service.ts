import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostUserDto } from 'src/user/dtos/post.user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async register(body: PostUserDto) {
    if (await this.checkUser(body)) {
      console.log('bad dick');

      //   await this.prisma.user.create({
      //     data: {
      //       email: body.email,
      //       name: body.username,
      //       googleId: body.googleId,
      //       password: body.password,
      //     },
      //   });
    } else {
      throw new RequestTimeoutException(
        'کاربر قبلا باایمیل ارسال شده ثبت نام کرده است.',
        {
          description: 'لطفا به صفحه ورود بروید و وارد حساب کاربری خود شوید.',
        },
      );
    }
  }
  login() {}
  async checkUser(body: PostUserDto) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { email: body.email },
      });      
      return userData;
    } catch (_err) {
      return false;
    }
  }
}

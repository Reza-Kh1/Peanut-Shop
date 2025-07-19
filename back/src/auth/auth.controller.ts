import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PostUserDto } from 'src/user/dtos/post.user.dto';
import { SetCookie } from 'src/auth/provider/set.cookie';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly setCookie: SetCookie) { }
  @Post('login')
  async authLogin(@Body() body: PostUserDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const information = await this.authService.login(body);
    return this.setCookie.setData(information, res, req)
  }
  @Post('register')
  async authRegister(@Body() body: PostUserDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const information = await this.authService.register(body);
    return this.setCookie.setData(information, res, req)
  }
}

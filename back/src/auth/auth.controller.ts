import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PostUserDto } from 'src/user/dtos/post.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  authLogin() {
    return;
  }
  @Post('register')
  authRegister(@Body() body: PostUserDto) {
    return this.authService.register(body);
  }
}

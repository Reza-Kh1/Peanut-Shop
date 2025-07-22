import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { PostUserDto } from './dtos/post.user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entities';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @UseGuards(AccessTokenGuard)
  @Get('/')
  getUser() {
    return { ok: "ok" }
  }
  @ApiCreatedResponse({ type: User })
  @ApiBody({ type: PostUserDto })
  @Post('')
  PostUser(@Body() createUserDto: PostUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Delete('')
  deleteUser() { }
  @Put('')
  updateUser() { }
}

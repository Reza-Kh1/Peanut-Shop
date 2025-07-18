import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { PostUserDto } from './dtos/post.user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entities';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  getUser() {}
    @ApiCreatedResponse({ type: User })
  @ApiBody({ type: PostUserDto })
  @Post('')
  PostUser(@Body() createUserDto: PostUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Delete('')
  deleteUser() {}
  @Put('')
  updateUser() {}
}

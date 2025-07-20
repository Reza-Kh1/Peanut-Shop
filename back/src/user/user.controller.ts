import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { PostUserDto } from './dtos/post.user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entities';
import { Role, Roles } from 'src/common/guard/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
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

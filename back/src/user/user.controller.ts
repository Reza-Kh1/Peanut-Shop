import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entities';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { QueryUserDto } from './dtos/query.user';
import { UpdateUserDto } from './dtos/update.user.dto';
import { PaginationResponse } from 'src/dtos/pagination-response.dto';

/** * کنترلر برای ساخت و اپدیت تمام کاربران سایت */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
 * دسترسی : ادمین.
 * با استفاده از کوئری ها سرچ برای افراد ثبت نام شده .
 * @param Query اطلاعات ورود شامل سرچ صفحه بندی و ...
 * @param req شیء درخواست برای احراز هویت 
 * @returns تمام کاربران و صفحه بندی ها
 */
  @Get('/')
  @UseGuards(AccessTokenGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'get all users', description: 'دسترسی : ادمین' })
  @ApiOkResponse({ type: PaginationResponse<UserEntity>, description: 'Get all user with query' })
  getUser(@Query() query: QueryUserDto) {
    return this.userService.getAllUser(query)
  }

  /**
 * با ارسال درخواست پروفایل کاربر ارسال میشه.
 * @param req شیء درخواست برای احراز هویت
 * @returns اطلاعات کاربر
 */
  @Get('profile')
  @UseGuards(AccessTokenGuard)
  @Roles('USER', 'ADMIN', 'AOTHUR', 'VENDOR')
  @ApiOperation({ summary: 'get Profile', description: 'دسترسی : تمام نقش های احراز هویت شده' })
  @ApiOkResponse({ type: UserEntity, description: 'Success' })
  async getProfile(@Req() req: Request) {
    return this.userService.getProfile(req)
  }

  /**
 * ساخت کاربر جدید توسط ادمین
 * @param body اطلاعاتی شامل ایمیل و رمز یا نام کاربر
 * @param req شیء درخواست برای احراز هویت
 * @returns پیغام تایید
 */
  @Post('/')
  @UseGuards(AccessTokenGuard)
  @Roles('ADMIN')
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiOperation({ summary: 'create users', description: 'دسترسی : ادمین' })
  @ApiBody({ type: UpdateUserDto })
  PostUser(@Body() createUserDto: UpdateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
 * حذف کاربر توسط ادمین با استفاده از پارام
 * @param Param اطلاعاتی شامل ایدی
 * @param req شیء درخواست برای احراز هویت
 * @returns پیغام تایید
 */
  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'شناسه کاربر که باید حذف شود', example: 'cf91f6d4-ba85-4dd4-b870-37dbf1702ca4' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiOperation({ summary: 'delete user with ID', description: 'دسترسی : ادمین' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id)
  }

  /**
 * کاربر میتواند اطلاعات خودش را اپدیت بکند 
 * زمانی که ایدی دریافت بشود باید احراز هویت ادمین تایید شود تا اطلاعات ایدی شخصی که ارسال شده را اپدیت کند
 * @param body اطلاعاتی شامل ایمیل و رمز یا نام کاربر یا ایدی که به صورت اختیاری هستش
 * @param req شیء درخواست برای احراز هویت
 * @returns پیغام تایید
 */
  @Put('/:id')
  @UseGuards(AccessTokenGuard)
  @Roles('USER', 'ADMIN', 'AOTHUR', 'VENDOR')
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiOperation({
    summary: 'update user',
    description: 'دسترسی : تمام نقش های احراز هویت شده'
  })
  @ApiBody({ type: UpdateUserDto ,description:'ارسال آیدی به صورت اختیاری هستش کاربر برای آپدیت پروفایل خودش نیاز به ارسال آیدی ندارد و زمانی که ادمین پروفایل شخص دیگری را آپدیت بکند نیاز به ارسال آیدی آن شخص است'})
  updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
    return this.userService.updateUser(body, req)
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dtos/create.wishlist.dto';
import { UpdateWishlistDto } from './dtos/update.wishlist.dto';
import { Request } from 'express';


/** * کنترلر برای ساخت و اپدیت تمام علاقه مندی های سایت */
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    /**
     * دسترسی : تمام کاربران احراز هویت شده
     * نمایش تمام علاقه مندی ها برای کاربران
    * @returns تمام علاقه مندی ها
    */
    @Get('/')
    @ApiOperation({ summary: 'get wishlist', description: 'دسترسی : تمام کاربران احراز هویت شده' })
    // @ApiOkResponse({ type: any, description: 'Get all user with query' })
    getCategoryUser(@Req() req: Request) {
        return this.wishlistService.getWishlist(req)
    }

    /**
    * دسترسی : تمام کاربران. احراز هویت شده
   * ساخت علاقه مندی جدید
   * @param body اطلاعاتی شامل ایدی محصول و متن همراه
   * @returns پیغام تایید
   */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'create wishlist', description: 'دسترسی : تمام کاربران احراز هویت شده' })
    @ApiBody({ type: CreateWishlistDto })
    PostCategory(@Body() body: CreateWishlistDto, @Req() req: Request) {
        return this.wishlistService.createWishlist(body, req);
    }

    /**
    * دسترسی : تمام کاربران. احراز هویت شده
     * حذف علاقه مندی
   * @param Param اطلاعاتی شامل ایدی
   * @returns پیغام تایید
   */
    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiParam({ name: 'id', description: 'آیدی علاقه مندی که باید حذف شود', example: '1' })
    @ApiOperation({ summary: 'delete wishlist with ID', description: 'دسترسی : تمام کاربران احراز هویت شده' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    deleteCategory(@Param('id') id: number) {
        return this.wishlistService.deleteWishlist(id)
    }

    /**
    * دسترسی : تمام کاربران. احراز هویت شده
    * آپدیت علاقه مندی
   * @param body  اطلاعاتی شامل متن همراه
   * @param Param اطلاعاتی شامل آیدی
   * @returns پیغام تایید
   */
    @Put('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'update wishlist', description: 'دسترسی : تمام کاربران احراز هویت شده' })
    @ApiBody({ type: UpdateWishlistDto, description: '' })
    updateCategory(@Body() body: UpdateWishlistDto, @Param('id') id: number) {
        return this.wishlistService.updateWishlist(body, id)
    }
}

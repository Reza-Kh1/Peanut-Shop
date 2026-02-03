import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CommentProductService } from './commentProduct.service';
import { QueryCommentProductDto } from './dtos/queryComment.dto';
import { CommentProductDto } from './dtos/commentProduct.create.dto';
import { Request } from 'express';
import { UpdateCommontProductDto } from './dtos/updateCommoneProduct.dto';
import { QueryCommentUserDto } from './dtos/queryUser.dto';

/** * کنترلر برای ساخت و اپدیت تمام کامنت محصولات سایت */
@ApiTags('Comment Product')
@Controller('comment-product')
export class CommentProductController {
    constructor(private readonly CommentProductService: CommentProductService) { }

    /**
     * نمایش تمام کامنت محصولات 
     * دسترسی : ادمین و نویسنده و فروشنده
     * @Query صفحه بندی
    * @returns تمام کامنت محصولات
    */
    @Get('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'VENDOR')
    @ApiOperation({ summary: 'get all Comment', description: 'دسترسی : ادمین و نویسنده و فروشنده' })
    // @ApiOkResponse({ type: CategoryEntity, description: 'Get all user with query' })
    getCommentProduct(@Query() query: QueryCommentProductDto) {
        return this.CommentProductService.getCommentProduct(query)
    }

    /**
     * نمایش تمام کامنت محصولات 
     * دسترسی : ادمین و نویسنده و فروشنده
     * @Query صفحه بندی
    * @returns تمام کامنت محصولات
    */
    @Get('/:id')
    @ApiParam({ name: 'id', description: 'آیدی محصولی که کامنت آن را میخواهید' })
    @ApiOperation({ summary: 'get Comment Single Product', description: 'دسترسی : تمام کاربران' })
    // @ApiOkResponse({ type: CategoryEntity, description: 'Get all user with query' })
    getCommentUser(@Param('id') id: string, @Query() query: QueryCommentUserDto) {
        return this.CommentProductService.getCommentUser(id, query)
    }

    /**
   * ساخت کامنت
   * دسترسی : تمام تمام نقش هایی که احراز هویت کرده اند
   * @param body اطلاعاتی شامل متن و امتیاز 
   * @returns پیغام تایید
   */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'VENDOR', 'USER')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'create Comment', description: 'دسترسی : تمام نقش هایی که احراز هویت کرده اند' })
    // @ApiBody({ type: CreateCategoryDto })
    PostCommentProduct(@Body() body: CommentProductDto, @Req() req: Request) {
        return this.CommentProductService.createCommentProduct(body, req);
    }

    /**
   * حذف کامنت
   * دسترسی : ادمین و نویسنده و فروشنده
   * @param Param اطلاعاتی شامل ایدی
   * @returns پیغام تایید
   */
    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiParam({ name: 'id', description: 'آیدی کامنت که باید حذف شود', example: '1' })
    @ApiQuery({ name: 'productId', description: 'آیدی محصولی که کامنت آن حذف میشود', example: '1' })
    @ApiOperation({ summary: 'delete Comment', description: 'دسترسی : ادمین' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    deleteCommentProduct(@Param('id') id: number, @Query('productId') productId: string) {
        return this.CommentProductService.deleteCommentProduct(id, productId)
    }

    /**
    * آپدیت کامنت ها
   * دسترسی : ادمین و نویسنده و فروشنده
   * @param body اطلاعاتی شامل متن امتیاز
   * @param Param اطلاعاتی شامل آیدی
   * @returns پیغام تایید
   */
    @Put('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'VENDOR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'update Comment', description: 'دسترسی :  ADMIN' })
    @ApiBody({ type: UpdateCommontProductDto, description: 'زمانی که کاربر امتیازی ثبت نکرده امتیاز به صورت خالی یعنی (نال) ارسال میشه و زمانی هم که امتیاز یا اطلاعاتی ارسال کرده باشه به صورت کامل باید ارسال بشه' })
    updateCommentProduct(@Body() body: UpdateCommontProductDto, @Param('id') id: number) {
        return this.CommentProductService.updateCommentProduct(body, id)
    }
}

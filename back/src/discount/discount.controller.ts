import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DiscountService } from './discount.service';
import { QuerySearchDto } from 'src/dtos/query.search.dto';
import { CreateDiscountDto } from './dtos/discount.create.dto';
import { PaginationResponse } from 'src/dtos/pagination-response.dto';
import { DiscountEntity } from './entities/discount.entities';

/** * کنترلر برای ساخت و اپدیت تمام تخفیف های سایت */
@Controller('discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) { }
    /**
     * نمایش تمام تخفیف ها
     * دسترسی : ADMIN
    * @returns تمام تخفیف ها
    */
    @Get('/')
    @ApiOperation({ summary: 'get all Discount', description: 'دسترسی : ADMIN' })
    @ApiOkResponse({ type: PaginationResponse<DiscountEntity>, description: 'Get all user with query' })
    getDiscount(@Query() query: QuerySearchDto) {
        return this.discountService.getDiscount(query)
    }

    /**
     * چک کردن تخفیف
     * دسترسی : همه کاربران
    * @returns پیغام تایید
    */
    @Get('/check')
    @ApiOperation({ summary: 'check in Discount', description: 'دسترسی : همه کاربران' })
    @ApiOkResponse({ schema: { example: { success: true } }, description: 'چک کردن درست بودن تخفیف' })
    checkDiscount(@Query() code: string) {
        return this.discountService.checkDiscount(code)
    }

    /**
   * ساخت تخفیف جدید
   * دسترسی : ادمین و نویسنده
   * @param body اطلاعاتی شامل نام و اسلاگ یا آیدی زیردسته
   * @returns پیغام تایید
   */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'create Discount', description: 'دسترسی : ADMIN' })
    @ApiBody({ type: CreateDiscountDto })
    PostDiscount(@Body() body: CreateDiscountDto) {
        return this.discountService.createDiscount(body);
    }

    /**
   * حذف تخفیف
   * دسترسی : ادمین
   * @param Param اطلاعاتی شامل ایدی
   * @returns پیغام تایید
   */
    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiParam({ name: 'id', description: 'آیدی تخفیف که باید حذف شود', example: '1' })
    @ApiOperation({ summary: 'delete Discount with ID', description: 'دسترسی : ADMIN' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    deleteDiscount(@Param('id') id: number) {
        return this.discountService.deleteDiscount(id)
    }

    /**
    * آپدیت تخفیف ها
   * دسترسی : ادمین و نویسنده
   * @param body اطلاعاتی شامل نام و اسلاگ یا آیدی زیردسته
   * @param Param اطلاعاتی شامل آیدی
   * @returns پیغام تایید
   */
    @Put('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'update Discount', description: 'دسترسی :  ADMIN' })
    @ApiBody({ type: CreateDiscountDto, description: 'کد را میشه به صورت خالی ارسال کرد' })
    updateDiscount(@Body() body: CreateDiscountDto, @Param('id') id: number) {
        return this.discountService.updateDiscount(body, id)
    }
}

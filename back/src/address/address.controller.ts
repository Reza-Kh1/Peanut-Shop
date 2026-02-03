import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create.address.dto';
import { AddressEntity } from './entities/address.entities';
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    /**
    *  تمام نقش های احراز هویت شده میتوانند آدرس ثبت کنند
    * @param body اطلاعاتی شامل متن ، کدپستی ، شماره تلفن و نام که به صورت اجباری است
    * @param req شیء درخواست برای احراز هویت
    * @returns پیغام تایید
    */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'USER', 'VENDOR')
    @ApiOperation({ summary: 'create address', description: 'دسترسی : تمام نقش های احراز هویت شده' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    createAddress(@Req() req: Request, @Body() body: CreateAddressDto) {
        return this.addressService.createAddress(req, body)
    }

    /**
    *  تمام نقش های احراز هویت شده میتوانند آدرس هایی که ثبت کردند را مشاهده کنند
    * ادمین با استفاده از آیدی مجاز به دیدن آدرس باقی افراد است
    * @Query آیدی کاربران که توسط ادمین ارسال میشود
    * @param req شیء درخواست برای احراز هویت
    * @returns اطلاعاتی شامل متن ، کدپستی ، شماره تلفن و نام ارسال خواهد شد
    */
    @Get('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'USER', 'VENDOR')
    @ApiOperation({ summary: 'get address', description: 'دسترسی : تمام نقش های احراز هویت شده' })
    @ApiQuery({ name: 'id', required: false, description: 'دسترسی : ادمین ، آیدی کاربر ارسال شود ' })
    @ApiOkResponse({ type: AddressEntity, isArray: true })
    getAddress(@Req() req: Request, @Query('id') id?: string) {
        return this.addressService.getAddress(req, id)
    }

    /**
    *  تمام نقش های احراز هویت شده میتوانند آدرس خود را آپدیت کنند
    * @Query آیدی آدرس که باید آپدیت شود
    * @param body اطلاعاتی شامل متن ، کدپستی ، شماره تلفن و نام که به صورت اجباری است
    * @param req شیء درخواست برای احراز هویت
    * @returns پیغام تایید
    */
    @Put('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'USER', 'VENDOR')
    @ApiOperation({ summary: 'update address', description: 'دسترسی :تمام نقش های احراز هویت شده' })
    @ApiParam({ name: 'id', description: 'آیدی آدرس که باید آپدیت شود' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    updateAddress(@Param('id') id: string, @Body() body: CreateAddressDto) {
        return this.addressService.updateAddress(id, body)
    }

    /**
    *  تمام نقش های احراز هویت شده میتوانند آدرس خود را حذف کنند
    * @Query آیدی آدرس که باید حذف شود
    * @param req شیء درخواست برای احراز هویت
    * @returns پیغام تایید
    */
    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'USER', 'VENDOR')
    @ApiOperation({ summary: 'delete address', description: 'دسترسی : تمام نقش های احراز هویت شده' })
    @ApiParam({ name: 'id', description: 'آیدی آدرس که باید حذف شود' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    deleteAddress(@Param('id') id: string) {
        return this.addressService.deleteAddress(id)
    }
}
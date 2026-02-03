import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { PaginationResponse } from 'src/dtos/pagination-response.dto';
import { ProductPreviewService } from './productPreview.service';
import { QueryProductReviewDto } from './dtos/query.productPreview.dto';
import { CreateProductPreviewDto } from './dtos/create.productPreview.dto';
import { ProductEntity } from './entities/productPreview.entities';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';


/** * کنترلر برای ساخت و اپدیت تمام محصولات سایت */
@ApiTags('Product Preview')
@Controller('product-preview')
export class ProductPreviewController {
    constructor(private readonly productService: ProductPreviewService) { }

    /**
   * دسترسی : تمام کاربران.
   * برای سرچ از کوئری ها استفاده شود
   * @param Query اطلاعات ورود شامل سرچ صفحه بندی و ...
   * @returns تمام محصولات و صفحه بندی ها
   */
    @Get('/')
    @ApiOperation({ summary: 'get all Procuct-User', description: 'دسترسی : تمام کاربران' })
    @ApiOkResponse({ type: PaginationResponse<ProductEntity>, description: 'Get all product with query' })
    getProductUser(@Query() query: QueryProductReviewDto) {
        return this.productService.getAllProductUser(query)
    }

    /**
   * دسترسی : ADMIN , AUTHOT , VENDOR.
   * برای سرچ از کوئری ها استفاده شود
   * @param Query اطلاعات ورود شامل سرچ صفحه بندی و ...
   * @returns تمام محصولات و صفحه بندی ها
   */
    @Get('/admin')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'VENDOR')
    @ApiOperation({ summary: 'get all Procuct-Admin', description: 'دسترسی : ADMIN , AUTHOT , VENDOR' })
    @ApiOkResponse({ type: PaginationResponse<ProductEntity>, description: 'Get all product with query' })
    async getProductAdmin(@Query() query: QueryProductReviewDto) {
        return this.productService.getAllProductAdmin(query)
    }

    /**
      * دسترسی : تمام کاربران.
      * دریافت یه محصول با استفاده از اسلاگ
      * @param Param اطلاعاتی شامل اسلاگ 
      * @returns محصول با تمام اطلاعات
      */
    @Get('/:slug')
    @ApiOperation({ summary: 'get single product', description: 'دسترسی : تمام کاربران' })
    @ApiOkResponse({ type: ProductEntity })
    @ApiParam({ name: 'slug', example: 'phone-galaxy', description: 'اسلاگ محصول را ارسال کنید تا تمام اطلاعاتش را به دست اورید' })
    async getSingleProduct(@Param("slug") slug: string) {
        return this.productService.getSingleProduct(slug)
    }

    /**
   * دسترسی : ADMIN , AUTHOT , VENDOR.
   * ساخت محصول جدید توسط نقش های مشخص شده
   * @param body اطلاعاتی شامل نام و اسلاگ و 
   * @param req شیء درخواست برای احراز هویت
   * @returns پیغام تایید
   */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR', 'VENDOR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'create product', description: 'دسترسی : ADMIN , AUTHOT , VENDOR' })
    @ApiBody({ type: CreateProductPreviewDto, description: 'دسته به صورت اجباری است' })
    PostProduct(@Body() createUserDto: CreateProductPreviewDto, @Req() req: Request) {
        return this.productService.createProduct(createUserDto, req);
    }

    /**
   * دسترسی : ADMIN , AUTHOT , VENDOR.
   * حذف محصول ثبت شده
   * @param Param اطلاعاتی شامل ایدی
   * @param req شیء درخواست برای احراز هویت
   * @returns پیغام تایید
   */
    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiParam({ name: 'id', description: 'آیدی محصول که باید حذف شود', example: '1' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'delete Product', description: 'دسترسی : ADMIN , AUTHOT , VENDOR' })
    deleteProduct(@Param('id') id: number) {
        return this.productService.deleteProduct(id)
    }

    /**
   * دسترسی : ADMIN , AUTHOT , VENDOR.
   * آپدیت محصول جدید توسط نقش های مشخص شده
   * @param Param اطلاعاتی شامل ایدی
   * @param body اطلاعاتی شامل نام و اسلاگ و 
   * @param req شیء درخواست برای احراز هویت
   * @returns پیغام تایید
   */
    @Put('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('USER', 'ADMIN', 'AOTHUR', 'VENDOR')
    @ApiOperation({ summary: 'update product', description: 'دسترسی : ADMIN , AUTHOT , VENDOR' })
    @ApiBody({ type: CreateProductPreviewDto })
    @ApiOkResponse({ schema: { example: { success: true } } })
    updateProduct(@Body() body: CreateProductPreviewDto, @Req() req: Request, @Param('id') id: number) {
        return this.productService.updateProduct(body, req, id)
    }
}

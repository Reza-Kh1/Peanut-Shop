import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductDto } from './dtos/createProduct.dto';
import { ProductService } from './product.service';

/** * کنترلر برای ساخت و اپدیت تمام جزئیات محصولات سایت */
@Controller('product')
export class ProductController {
    constructor(private readonly categoryService: ProductService) { }
    /**
   * ساخت جزئیات محصولات
   * دسترسی : ادمین و فروشنده و نویسنده
   * @param body اطلاعاتی شامل نام و محتوا یا تایتل
   * @returns پیغام تایید
   */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'VENDOR', 'AUTHOR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'create product', description: 'دسترسی : ادمین و فروشنده و نویسنده' })
    @ApiBody({ type: CreateProductDto })
    PostProduct(@Body() createUserDto: CreateProductDto) {
        return this.categoryService.createProduct(createUserDto);
    }

    /**
     * آپدیت جزئیات محصولات
   * دسترسی : ادمین و نویسنده
   * @param body اطلاعاتی شامل نام و اسلاگ یا آیدی زیردسته
   * @param Param اطلاعاتی شامل آیدی
   * @returns پیغام تایید
   */
    @Put('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'update category', description: 'دسترسی :  ADMIN , AOTHUR' })
    @ApiParam({ name: 'id', example: '1', description: 'آیدی جزئیات محصول را برای آپدیت شدن ارسال کنید (Product)' })
    @ApiBody({ type: CreateProductDto, description: '' })
    updateCategory(@Body() body: any, @Param('id') id: number) {
        return this.categoryService.updateProduct(body, id)
    }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

/** * کنترلر برای ساخت و اپدیت تمام دسته های سایت */
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: any) { }

    /**
     * نمایش تمام دسته ها برای کاربران
     * دسترسی : تمام کاربران.
    * @returns تمام دسته و زیردسته ها
    */
    @Get('/')
    @ApiOperation({ summary: 'get all category Users', description: 'دسترسی : تمام کاربران' })
    // @ApiOkResponse({ type: CategoryEntity, description: 'Get all user with query' })
    getCategoryUser() {
        return this.categoryService.getCategoryUsers()
    }

    /**
   * ساخت دسته جدید
   * دسترسی : ادمین و نویسنده
   * @param body اطلاعاتی شامل نام و اسلاگ یا آیدی زیردسته
   * @returns پیغام تایید
   */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'create category', description: 'دسترسی : ADMIN , AOTHUR' })
    // @ApiBody({ type: CreateCategoryDto })
    PostCategory(@Body() createUserDto: any) {
        return this.categoryService.createCategory(createUserDto);
    }

    /**
   * حذف دسته
   * دسترسی : ادمین و نویسنده
   * @param Param اطلاعاتی شامل ایدی
   * @returns پیغام تایید
   */
    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN')
    @ApiParam({ name: 'id', description: 'آیدی دسته که باید حذف شود', example: '1' })
    @ApiOperation({ summary: 'delete category with ID', description: 'دسترسی : ADMIN , AOTHUR' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    deleteCategory(@Param('id') id: number) {
        return this.categoryService.deleteCategory(id)
    }

    /**
     * آپدیت دسته ها
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
    // @ApiBody({ type: CreateCategoryDto, description: '' })
    updateCategory(@Body() body: any, @Param('id') id: number) {
        return this.categoryService.updateCategory(body, id)
    }
}

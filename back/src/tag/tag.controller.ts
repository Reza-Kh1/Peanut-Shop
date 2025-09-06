import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { TagService } from './tag.service';
import { CreateTagDto } from './dtos/tag.create.dto';
import { TagEntity } from './entities/tag.entities';

/** * کنترلر برای ساخت و اپدیت تمام تگ های سایت */
@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    /**
     * دسترسی : تمام کاربران.
    * نمایش تمام تگ ها
    * @returns تمام تگ ها
    */
    @Get('/')
    @ApiOperation({ summary: 'get Tags', description: 'دسترسی : تمام کاربران' })
    @ApiOkResponse({ type: TagEntity, description: 'فقط اسم تگ' })
    getTag() {
        return this.tagService.getTag()
    }

    /**
    * دسترسی : ادمین و نویسنده
   * ساخت تگ جدید
   * @param body اطلاعاتی شامل نام 
   * @returns پیغام تایید
   */
    @Post('/')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'create Tag', description: 'دسترسی : ADMIN , AOTHUR' })
    @ApiBody({ type: CreateTagDto })
    PostTag(@Body() createUserDto: any) {
        return this.tagService.createTag(createUserDto);
    }

    /**
   * حذف تگ
   * دسترسی : ادمین و نویسنده
   * @param Param اطلاعاتی شامل ایدی
   * @returns پیغام تایید
   */
    @Delete('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR')
    @ApiParam({ name: 'id', description: 'آیدی تگ که باید حذف شود', example: '1' })
    @ApiOperation({ summary: 'delete Tag with ID', description: 'دسترسی : ADMIN , AOTHUR' })
    @ApiOkResponse({ schema: { example: { success: true } } })
    deleteTag(@Param('id') id: number) {
        return this.tagService.deleteTag(id)
    }

    /**
     * آپدیت تگ ها
   * دسترسی : ادمین و نویسنده
   * @param body اطلاعاتی شامل نام
   * @param Param اطلاعاتی شامل آیدی
   * @returns پیغام تایید
   */
    @Put('/:id')
    @UseGuards(AccessTokenGuard)
    @Roles('ADMIN', 'AOTHUR')
    @ApiOkResponse({ schema: { example: { success: true } } })
    @ApiOperation({ summary: 'update Tag', description: 'دسترسی :  ADMIN , AOTHUR' })
    @ApiBody({ type: CreateTagDto, description: 'نام و آیدی تگ را ارسال کنید' })
    updateTag(@Body() body: any, @Param('id') id: number) {
        return this.tagService.updateTag(body, id)
    }
}

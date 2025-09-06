import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, } from 'class-validator';

export class CommentProductDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'اولین کامنت برای محصول', required: true, description: 'متن کامنت' })
    content!: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 3, nullable: true, required: false, description: 'امتیازی که به محصول داده میشه ارسال هم نکرد و به صورت پرسش کامنت گذاشت که در امتیاز بندی محاسبه نمیشود' })
    rate?: number;

    @IsNumber()
    @ApiProperty({ example: 1, required: true, description: 'آیدی محصولی که کامنت برای آن در حال ثبت شدن هست' })
    productPreviewId!: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 1, required: false, description: 'در حالت عادی خالی ارسال شود و زمانی که به کاربر دیگری پاسخ بدهیم آیدی کامنت آن کاربر رو اینجا ارسال میکنیم' })
    parentId?: number;
}
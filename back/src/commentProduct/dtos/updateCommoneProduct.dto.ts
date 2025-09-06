import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, } from 'class-validator';

export class UpdateCommontProductDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'اولین کامنت برای محصول', description: 'متن کامنت' })
    content!: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 3, required: false, description: 'زمانی که امتیاز دهی ارسال نشود در مجموع امتیازات در نظر گرفته نمیشود' })
    rate!: number;

    @IsNumber()
    @ApiProperty({ example: 1, required: true, description: 'آیدی محصولی که کامنت برای آن در حال ثبت شدن هست' })
    productPreviewId!: number;
}
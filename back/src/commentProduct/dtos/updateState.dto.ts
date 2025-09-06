import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, } from 'class-validator';
import { QueryDefaultDto } from 'src/dtos/query.defualt.dto';

export class UpdateStateDto {
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

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: false, required: true, description: 'وضعیت کامنت' })
    state!: boolean;
}
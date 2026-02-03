import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateDiscountDto {
    @IsString()
    @ApiProperty({ example: 'تخفیف بهاری', required: true, description: 'توضیحات  تخفیف قابل مشاهده فقط برای ادمین' })
    title!: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'TEST', nullable: true, required: false, description: 'کد تخفیف که به صورت یونیک هستش و میشه به صورت خالی هم ارسال کرد برای زمانی که از یه تخفیف برای چندین محصول به صورت عمومی استفاده کنیم که دیگر نیازی به کد تخفیف نداریم' })
    code!: string;

    @ApiProperty({ example: false, required: true, description: 'زمانی که تخفیف بین چندین محصول مورد استفاده قرار بگیره' })
    @IsBoolean()
    isGlobal!: boolean;

    @ApiProperty({ example: 40000, required: true, description: 'مقدار تخفیف به صورت تومان محاسبه میشود' })
    @IsNumber()
    price!: number;

    @ApiProperty({ example: 10, required: true, description: 'مقدار افرادی که از تخفیف استفاده کردن' })
    @IsNumber()
    usedCode!: number;

    @ApiProperty({ example: '2025-09-03T09:10:06.207Z', required: true, description: 'زمان شروع تخفیف' })
    @Type(() => Date)
    @IsDate()
    beginDate!: Date;

    @ApiProperty({ example: '2025-09-03T09:10:06.207Z', required: true, description: 'زمان پایان تخفیف' })
    @Type(() => Date)
    @IsDate()
    expiredDate!: Date;
}
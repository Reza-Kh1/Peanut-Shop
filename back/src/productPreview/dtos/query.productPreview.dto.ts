import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, } from 'class-validator';
import { QueryDefaultDto } from 'src/dtos/query.defualt.dto';

export class QueryProductReviewDto extends QueryDefaultDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: null, required: false, description: 'جستجو در بخش اسم و توضیحات' })
    search?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: true, required: false, description: 'محصولات موجود در سایت' })
    isStock?: string

    @IsOptional()
    @IsString()
    @ApiProperty({ example: null, required: false, description: 'بیش ترین قیمت' })
    minPrice?: number

    @IsOptional()
    @IsString()
    @ApiProperty({ example: null, required: false, description: 'کمترین قیمت' })
    maxPrice?: number

    @IsOptional()
    @IsString()
    @ApiProperty({ example: null, required: false, description: 'آیدی دسته' })
    categoryId?: number

    @IsOptional()
    @IsString()
    @ApiProperty({ example: null, required: false, description: 'آیدی تخفیف' })
    discountId?: number
}
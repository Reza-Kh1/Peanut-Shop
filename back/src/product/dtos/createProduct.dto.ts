import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, isString, IsString, } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @ApiProperty({ example: 'محصول با کیفیت...', required: true })
    content?: string;

    @IsOptional()
    @ApiProperty({ example: '"["وزن محصول","رنگ محصول"]"', required: false })
    attribute?: string;

    @IsOptional()
    @ApiProperty({ example: '', required: false, nullable: true })
    video?: string;

    @IsOptional()
    @ApiProperty({ isArray: true, example: '[]', required: false })
    gallery?: string[];

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '', required: false, nullable: true })
    image?: string;

    @IsString()
    @ApiProperty({ example: 'گوشی ارزان قیمت', required: true })
    title!: string;

    @IsOptional()
    @ApiProperty({ example: '[]', isArray: true, required: false })
    keywords?: string[];

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'https://test', required: false, nullable: true })
    canonicalUrl?: string;

    @IsNumber()
    @ApiProperty({ example: '1', required: true })
    productId!: number;
}
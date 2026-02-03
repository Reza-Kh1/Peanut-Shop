import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, } from 'class-validator';

export class CreateProductPreviewDto {
    @IsString()
    @ApiProperty({ example: 'samsung galaxy 23', required: true })
    name!: string;

    @IsString()
    @ApiProperty({ example: 'phone-galaxy', required: true })
    slug!: string;

    @IsBoolean()
    @ApiProperty({ example: true, required: true })
    isApprove!: boolean;

    @IsBoolean()
    @ApiProperty({ example: true, required: true })
    isStock!: boolean;

    @IsString()
    @ApiProperty({ example: '', required: false })
    image!: string;

    @IsNumber()
    @ApiProperty({ example: 230000, required: true })
    price!: number;

    @IsString()
    @ApiProperty({ example: 'the best phone for world', required: false })
    description!: string;

    @IsNumber()
    @ApiProperty({ example: 1, required: true })
    categoryId!: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: null, required: false, nullable: true })
    discountId!: number;

    @IsOptional()
    @ApiProperty({ example: '[]', isArray: true, required: false, nullable: true })
    tagId!: number[];
}
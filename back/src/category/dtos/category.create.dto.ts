import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @ApiProperty({ example: 'گوشی', required: true })
    name!: string;

    @IsString()
    @ApiProperty({ example: 'phone', required: true })
    slug!: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 0, required: false, type: Number, nullable: true })
    parentId?: number;
}
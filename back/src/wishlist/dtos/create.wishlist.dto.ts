import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, } from 'class-validator';

export class CreateWishlistDto {
    @IsNumber()
    @ApiProperty({ example: 1, required: false, description: 'ایدی محصول افزوده شده' })
    productId!: number

    @IsString()
    @ApiProperty({ example: 'this good item', required: false, description: 'متن همراه علاقه مندی ها', nullable: true })
    note?: string
}
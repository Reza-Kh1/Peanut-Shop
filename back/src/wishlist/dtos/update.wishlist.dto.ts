import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, } from 'class-validator';

export class UpdateWishlistDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'this good item', required: false, description: 'متن همراه علاقه مندی ها', nullable: true })
    note?: string
}
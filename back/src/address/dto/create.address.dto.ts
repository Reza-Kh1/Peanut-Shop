import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, } from 'class-validator';

export class CreateAddressDto {
    @ApiProperty({ example: 'address ali', required: true })
    @IsString()
    content!: string;

    @IsString()
    @ApiProperty({ example: '09390199977', required: true })
    phone!: string;

    @IsString()
    @ApiProperty({ example: 'haj ali', required: true })
    name!: string;

    @IsString()
    @ApiProperty({ example: '871283964', required: true })
    zipCode!: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, } from 'class-validator';

export class CreateTagDto {
    @IsString()
    @ApiProperty({ example: 'آجیل', required: true })
    name!: string;
}

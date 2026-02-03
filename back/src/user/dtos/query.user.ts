import { ApiProperty } from '@nestjs/swagger';
import { RolePerson } from '@prisma/client';
import { IsOptional, IsString, } from 'class-validator';
import { QueryDefaultDto } from 'src/dtos/query.defualt.dto';

export class QueryUserDto extends QueryDefaultDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'ali', required: false, description: 'جستجو در بخش اسم و شماره تلفن' })
    search?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'USER', required: false, description: 'سطح های کاربری مجاز' })
    role?: RolePerson;

}
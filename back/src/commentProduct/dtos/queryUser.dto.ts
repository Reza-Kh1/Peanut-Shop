import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, } from 'class-validator';
import { QueryDefaultDto } from 'src/dtos/query.defualt.dto';

export class QueryCommentUserDto extends QueryDefaultDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: '', required: false, description: 'در صورتی که کامنت های یک محصول را بخواهید ایدی را ارسال کنید' })
    parentId?: string
}
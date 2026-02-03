import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class CategoryEntity {
    @ApiProperty()
    id!: number

    @ApiProperty()
    name!: string

    @ApiProperty()
    slug!: string

    @IsOptional()
    @ApiProperty()
    parentId!: number

    @ApiProperty()
    createdAt!: Date
}
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
    @ApiProperty({ example: 1, description: 'صفحه بعد' })
    nextPage!: number;

    @ApiProperty({ example: 10, description: 'صفحه قبل' })
    prevPage!: number;

    @ApiProperty({ example: 100, description: 'تمام صفحات' })
    total!: number;

    @ApiProperty({ description: 'داده‌ها' })
    data!: T[];
}

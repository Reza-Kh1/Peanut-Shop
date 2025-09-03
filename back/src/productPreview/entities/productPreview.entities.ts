import { ApiProperty } from '@nestjs/swagger';
export class ProductEntity {
    @ApiProperty()
    id!: number

    @ApiProperty()
    sku!: string

    @ApiProperty()
    slug!: string

    @ApiProperty()
    name!: string

    @ApiProperty()
    isPublished!: boolean

    @ApiProperty()
    isStock!: boolean

    @ApiProperty({ nullable: true })
    image!: null | string

    @ApiProperty()
    price!: number

    @ApiProperty({ nullable: true })
    ratingAvg!: null | string

    @ApiProperty({ nullable: true })
    ratingCount!: null | string

    @ApiProperty({ nullable: true })
    commentCount!: null | string

    @ApiProperty()
    description!: string

    @ApiProperty()

    authorIdUpdate!: string

    @ApiProperty()
    authorId!: string

    @ApiProperty()
    categoryId!: number


    @ApiProperty({ nullable: true })
    discountId!: null | number

    @ApiProperty()
    createdAt!: Date

    @ApiProperty()
    updatedAt!: Date
}
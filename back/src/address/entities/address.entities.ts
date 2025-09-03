import { ApiProperty } from '@nestjs/swagger';
export class AddressEntity {
    @ApiProperty()
    id!: number

    @ApiProperty()
    content!: string

    @ApiProperty()
    phone!: string

    @ApiProperty()
    name!: string

    @ApiProperty()
    zipCode!: string

    @ApiProperty()
    userId!: string
}
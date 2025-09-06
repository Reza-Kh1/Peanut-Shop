import { ApiProperty } from '@nestjs/swagger';
export class DiscountEntity {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  code?: string;

  @ApiProperty()
  isGlobal!: boolean;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  usedCode!: number;

  @ApiProperty()
  beginDate!: Date;

  @ApiProperty()
  expiredDate!: Date;

  @ApiProperty()
  createdAt!: Date;
}

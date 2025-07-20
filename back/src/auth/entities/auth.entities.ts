import { ApiProperty } from '@nestjs/swagger';

export class AuthEntities {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true, example: 'google-uid-123' })
  googleId?: string

  @ApiProperty({ nullable: true, example: '09390199977', type: 'string' })
  phone?: null | string

  @ApiProperty({ example: 'USER', enum: ['ADMIN', 'USER', 'AUTHOR'] })
  role!: "ADMIN" | "USER" | "AUTHOR";

  @ApiProperty()
  createdAt?: Date;
}

import { ApiProperty } from '@nestjs/swagger';

export class AuthEntities {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  googleId?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  role!: "ADMIN" | "USER" | "AUTHOR";

  @ApiProperty()
  createdAt?: Date;
}

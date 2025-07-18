import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
  
  @ApiProperty()
  googleId!: string;

  @ApiProperty()
  createdAt!: Date;
}

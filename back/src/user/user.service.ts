import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostUserDto } from './dtos/post.user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(dto: PostUserDto) {
    return this.prisma.user.create({
      data: {
        name: dto.username,
        email: dto.email,
        googleId: dto.googleId, // در عمل باید hash بشه
        password: dto.password,
      },
    });
  }
}

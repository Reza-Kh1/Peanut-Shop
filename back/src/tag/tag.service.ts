import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dtos/tag.create.dto';

@Injectable()
export class TagService {
    constructor(private readonly prisma: PrismaService) { }

    async createTag(body: CreateTagDto) {
        await this.prisma.tag.create({
            data: {
                name: body.name
            },
        });
        return { success: true }
    }

    async getTag() {
        const data = await this.prisma.tag.findMany({});
        return data
    }

    async updateTag(body: CreateTagDto, id: number) {
        await this.prisma.tag.update({
            where: {
                id: Number(id)
            },
            data: {
                name: body.name
            },
        });
        return { success: true }
    }

    async deleteTag(id: number) {
        await this.prisma.tag.delete({
            where: {
                id: Number(id)
            }
        })
        return { success: true }
    }
}

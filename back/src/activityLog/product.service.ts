import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class _Service {
    constructor(private readonly prisma: PrismaService) { }

    async createCategory(body: any) {
        await this.prisma.category.create({
            data: {
                name: body.name,
                slug: body.slug,
                parentId: Number(body.parentId) || undefined
            },
        });
        return { success: true }
    }

    async get() {

    }

    async updateCategory(body: any, id: number) {

        return { success: true }
    }

    async deleteCategory(id: number) {
        await this.prisma.category.delete({
            where: {
                id: Number(id)
            }
        })
        return { success: true }
    }
}

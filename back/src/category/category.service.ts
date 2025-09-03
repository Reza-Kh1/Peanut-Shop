import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/category.create.dto';

export interface CategoryTree {
    id: number;
    name: string;
    slug: string;
    children: CategoryTree[];
}

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async getCategoryUsers(parentId: number | null = null): Promise<CategoryTree[]> {
        const categories = await this.prisma.category.findMany({
            where: { parentId },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        return Promise.all(
            categories.map(async (cat) => ({
                ...cat,
                children: await this.getCategoryUsers(cat.id), // اینجا children دقیقا از جنس CategoryTree[] میشه
            })),
        );
    }

    async updateCategory(body: CreateCategoryDto, id: number) {
        await this.prisma.category.update({
            where: { id: Number(id) },
            data: {
                slug: body.slug || undefined,
                name: body.name || undefined,
                parentId: Number(body.parentId) || undefined,
            }
        })
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

    async createCategory(body: CreateCategoryDto) {
        await this.prisma.category.create({
            data: {
                name: body.name,
                slug: body.slug,
                parentId: Number(body.parentId) || undefined
            },
        });
        return { success: true }
    }
}

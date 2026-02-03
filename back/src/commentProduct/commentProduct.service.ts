import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import pagination from 'src/common/utils/pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentProductDto } from './dtos/commentProduct.create.dto';
import { Request } from 'express';
import { QueryCommentProductDto } from './dtos/queryComment.dto';
import { UpdateCommontProductDto } from './dtos/updateCommoneProduct.dto';
import { QueryCommentUserDto } from './dtos/queryUser.dto';

@Injectable()
export class CommentProductService {
    constructor(private readonly prisma: PrismaService) { }

    async createCommentProduct(body: CommentProductDto, req: Request) {
        if (!req.user?.id) throw new ForbiddenException('وارد حساب کاربری خود شوید')
        if (req.user.role !== 'USER') {
            await this.prisma.productPreview.update({
                where: { id: body.productPreviewId },
                data: {
                    commentCount: { increment: 1 }
                }
            })
        }
        await this.prisma.commentProduct.create({
            data: {
                content: body.content,
                name: req.user?.name || 'ناشناس',
                state: req.user.role === 'USER' ? false : true,
                parentId: body.parentId || undefined,
                rate: req.user.role !== 'USER' ? undefined : body.rate || undefined,
                productPreviewId: body.productPreviewId,
                userId: req.user?.id,
            }
        });
        return { success: true }
    }

    async getCommentProduct(query: QueryCommentProductDto) {
        const { page = 1, order = 'desc', limit = 10, state, productId } = query;
        const searchFilter = {
            state: state === 'true' ? true : false
        } as any
        if (productId) {
            searchFilter.productPreviewId = Number(productId)
        }
        const data = await this.prisma.commentProduct.findMany({
            where: searchFilter,
            orderBy: { createdAt: order || 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        const count = await this.prisma.commentProduct.count({ where: searchFilter });
        const paginations = pagination(count, Number(page), Number(limit));
        return { data, ...paginations };
    }

    async updateCommentProduct(body: UpdateCommontProductDto, id: number) {
        await this.prisma.commentProduct.update({
            where: { id: Number(id) },
            data: {
                content: body.content,
                state: true,
                rate: body.rate || undefined,
            }
        });

        if (body.rate) {
            const product = await this.prisma.productPreview.findUnique({
                where: { id: body.productPreviewId },
                select: { ratingAvg: true, ratingCount: true, commentCount: true }
            });

            const oldAvg = Number(product?.ratingAvg) || 0;
            const oldCount = Number(product?.ratingCount) || 0;
            const newRate = Number(body.rate);

            const newCount = oldCount + 1;
            const newAvg = (oldAvg * oldCount + newRate) / newCount;

            await this.prisma.productPreview.update({
                where: { id: body.productPreviewId },
                data: {
                    commentCount: { increment: 1 },
                    ratingCount: { increment: 1 },
                    ratingAvg: Number(newAvg.toFixed(1))
                }
            });
        } else {
            await this.prisma.productPreview.update({
                where: { id: body.productPreviewId },
                data: {
                    commentCount: { increment: 1 }
                }
            });
        }

        return { success: true }
    }

    async deleteCommentProduct(id: number, productId: string) {
        await this.prisma.commentProduct.delete({
            where: {
                id: Number(id)
            }
        })
        const agg = await this.prisma.commentProduct.aggregate({
            where: { productPreviewId: Number(productId), state: true },
            _count: { id: true },
            _avg: { rate: true }
        });
        await this.prisma.productPreview.update({
            where: { id: Number(productId) },
            data: {
                commentCount: agg._count.id,
                ratingCount: agg._count.id,
                ratingAvg: Number(agg._avg.rate?.toFixed(1)) || 0
            }
        });

        return { success: true }
    }

    async getCommentUser(productId: string, query: QueryCommentUserDto) {
        const { page = 1, order = 'desc', limit = 10, parentId } = query;
        const selectPrisma = {
            children: {
                select: {
                    children: true,
                    name: true,
                    id: true,
                    createdAt: true,
                    rate: true,
                    parentId: true,
                },
            },
            name: true,
            id: true,
            createdAt: true,
            rate: true,
            parentId: true,
        }
        if (parentId) {
            const data = await this.prisma.commentProduct.findUnique({
                where: { id: Number(parentId), state: true },
                select: selectPrisma
            });
            return data;
        } else {
            const data = await this.prisma.commentProduct.findMany({
                where: { productPreviewId: Number(productId), state: true },
                select: selectPrisma,
                orderBy: { createdAt: order || 'desc' },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            });
            const count = await this.prisma.commentProduct.count({ where: { productPreviewId: Number(productId) } });
            const paginations = pagination(count, Number(page), Number(limit));
            return { data, ...paginations };
        }
    }
}

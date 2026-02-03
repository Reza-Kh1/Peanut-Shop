import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWishlistDto } from './dtos/create.wishlist.dto';
import { Request } from 'express';
import { UpdateWishlistDto } from './dtos/update.wishlist.dto';



@Injectable()
export class WishlistService {
    constructor(private readonly prisma: PrismaService) { }

    async getWishlist(req: Request) {
        const data = await this.prisma.wishlist.findMany({
            where: {
                userId: req.user?.id,
            },
            select: {
                id: true,
                note: true,
                ProductPreview: {
                    select: {
                        name: true,
                        isApprove: true,
                        image: true,
                        price: true,
                        slug: true,
                        discountId: true,
                        isStock: true,
                        ratingAvg: true,
                        ratingCount: true,
                        commentCount: true,
                        description: true,
                    }
                }
            }
        })
        return data
    }

    async updateWishlist(body: UpdateWishlistDto, id: number) {
        await this.prisma.wishlist.update({
            where: { id: Number(id) },
            data: {
                note: body.note
            }
        })
        return { success: true }
    }

    async deleteWishlist(id: number) {
        await this.prisma.wishlist.delete({
            where: {
                id: Number(id)
            }
        })
        return { success: true }
    }

    async createWishlist(body: CreateWishlistDto, req: Request) {
        if (!req.user?.id) throw new ForbiddenException('خطا دوباره تلاش کنید')
        await this.prisma.wishlist.create({
            data: {
                productId: body.productId,
                note: body.note || '',
                userId: req.user?.id
            },
        });
        return { success: true }
    }
}

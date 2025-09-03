import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dtos/createProduct.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(body: CreateProductDto) {
        console.log(body);
        
        await this.prisma.product.create({
            data: {
                content: body.content||'',
                title: body.title,
                attribute: body.attribute,
                canonicalUrl: body.canonicalUrl,
                gallery: body.gallery,
                image: body.image,
                keywords: body.keywords,
                productId: body.productId,
                video: body.video
            },
        });
        return { success: true }
    }

    async updateProduct(body: any, id: number) {
        await this.prisma.product.update({
            where: {
                id: Number(id)
            },
            data: {
                content: body.content || undefined,
                title: body.title || undefined,
                attribute: body.attribute || undefined,
                canonicalUrl: body.canonicalUrl || undefined,
                gallery: body.gallery || undefined,
                image: body.image || undefined,
                keywords: body.keywords || undefined,
                productId: body.productId || undefined,
                video: body.video || undefined,
            },
        });
        return { success: true }
    }
}

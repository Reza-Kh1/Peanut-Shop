import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import pagination from 'src/common/utils/pagination';
import { CreateProductPreviewDto } from './dtos/create.productPreview.dto';
import { customAlphabet } from 'nanoid';
import { QueryProductReviewDto } from './dtos/query.productPreview.dto';

@Injectable()
export class ProductPreviewService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllProductUser(query: QueryProductReviewDto) {
    const { page = 1, order = 'desc', limit = 10 } = query;
    const searchFilter = { ...this.filterQuery(query), isApprove: true }
    const data = await this.prisma.productPreview.findMany({
      where: searchFilter,
      orderBy: { createdAt: order || 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    const count = await this.prisma.productPreview.count({ where: searchFilter });
    const paginations = pagination(count, Number(page), Number(limit));
    return { data, ...paginations };
  }

  async getAllProductAdmin(query: QueryProductReviewDto) {
    const { page = 1, order = 'desc', limit = 10 } = query;
    const searchFilter = { ...this.filterQuery(query) }
    const data = await this.prisma.productPreview.findMany({
      where: searchFilter,
      orderBy: { createdAt: order || 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    const count = await this.prisma.productPreview.count({ where: searchFilter });
    const paginations = pagination(count, Number(page), Number(limit));
    return { data, ...paginations };
  }

  async getSingleProduct(slug: string) {
    const data = await this.prisma.productPreview.findMany({
      where: { slug },
      include: {
        ProductDetails: true,
        Comment: true,
        Category: {
          select: {
            name: true,
            slug: true,

          }
        },
        Discount: {
          select: {
            usedCode: true,
            expiredDate: true,
            beginDate: true,
            discountAmount: true
          }
        },
        User: {
          select: {
            name: true,
            role: true,
          }
        }
      }
    })
    return data
  }

  async updateProduct(body: CreateProductPreviewDto, req: Request, id: number) {
    const data = await this.prisma.productPreview.update({
      where: {
        id: id
      },
      data: {
        isApprove: body.isApprove,
        isStock: body.isStock,
        name: body.name || undefined,
        slug: body.slug || undefined,
        discountId: body.discountId,
        image: body.image,
        categoryId: body.categoryId || undefined,
        description: body.description,
        price: body.price,
        Tags: body.tagId ? { set: body.tagId.map((id) => ({ id })) } : undefined
      }
    })
    if (!data) {
      throw new NotFoundException('کاربر یافت نشد')
    }
    return { success: true }
  }

  async deleteProduct(id: number) {
    await this.prisma.productPreview.delete({
      where: {
        id
      }
    })
    return { success: true }
  }

  async createProduct(body: CreateProductPreviewDto, req: Request) {
    if (!req.user?.id) throw new BadRequestException('وارد حساب کاربری خود شوید')
    await this.prisma.productPreview.create({
      data: {
        isApprove: body.isApprove,
        isStock: body.isStock,
        sku: this.createKeycode(),
        name: body.name,
        slug: body.slug,
        discountId: body.discountId,
        image: body.image,
        categoryId: body.categoryId,
        description: body.description,
        authorId: req.user?.id,
        price: body.price,

      },
    });
    return { success: true }
  }

  private createKeycode() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const nanoidCustom = customAlphabet(alphabet, 10);
    const keyCode = nanoidCustom();
    return keyCode
  }

  private filterQuery(query: QueryProductReviewDto) {
    const { search, categoryId, discountId, isStock, maxPrice, minPrice } = query;
    const searchFilter = {} as any;
    if (search) {
      searchFilter.OR = [
        {
          name: { contains: search.toString(), mode: 'insensitive' }
        },
        {
          description: { contains: search.toString(), mode: 'insensitive' }
        },
      ];
    }
    if (categoryId) {
      searchFilter.categoryId = Number(categoryId)
    }
    if (isStock) {
      searchFilter.isStock = isStock === 'true' ? true : false
    }
    if (discountId) {
      searchFilter.discountId = Number(discountId)
    }
    if (minPrice || maxPrice) {
      searchFilter.price = {
        gte: Number(minPrice) || undefined,
        lte: Number(maxPrice) || undefined,
      }
    }
    return searchFilter
  }
}

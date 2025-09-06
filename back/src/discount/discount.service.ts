import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import pagination from 'src/common/utils/pagination';
import { QuerySearchDto } from 'src/dtos/query.search.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dtos/discount.create.dto';

@Injectable()
export class DiscountService {
    constructor(private readonly prisma: PrismaService) { }

    async createDiscount(body: CreateDiscountDto) {
        await this.prisma.discount.create({
            data: {
                code: body.code,
                price: body.price,
                expiredDate: body.expiredDate,
                beginDate: body.beginDate,
                isGlobal: body.isGlobal,
                title: body.title,
                usedCode: Number(body.usedCode)
            },
        });
        return { success: true }
    }

    async getDiscount(query: QuerySearchDto) {
        const { page = 1, order = 'desc', limit = 10, search } = query;

        const data = await this.prisma.discount.findMany({
            where: { title: search ? { contains: search.toString(), mode: 'insensitive' } : undefined },
            orderBy: { createdAt: order || 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        const count = await this.prisma.discount.count({ where: { title: search || undefined } });
        const paginations = pagination(count, Number(page), Number(limit));
        return { data, ...paginations };
    }

    async checkDiscount(code: string) {
        const now = new Date();
        const discount = await this.prisma.discount.findUnique({
            where: {
                code: code,
            }
        });
        if (!discount) {
            throw new NotFoundException('کد تخفیف یافت نشد');
        }

        if (discount.expiredDate < now) {
            throw new BadRequestException('کد تخفیف منقضی شده است');
        }

        if (discount.beginDate > now) {
            throw new BadRequestException('کد تخفیف هنوز فعال نشده است');
        }

        if (discount.usedCode <= 0) {
            throw new BadRequestException('تعداد استفاده از کد تخفیف به پایان رسیده است');
        }

        return { success: true };
    }

    async updateDiscount(body: CreateDiscountDto, id: number) {
        await this.prisma.discount.update({
            where: {
                id: Number(id)
            }, data: {
                code: body.code,
                price: body.price,
                expiredDate: body.expiredDate,
                beginDate: body.beginDate,
                isGlobal: body.isGlobal,
                title: body.title,
                usedCode: Number(body.usedCode)
            }
        })
        return { success: true }
    }

    async deleteDiscount(id: number) {
        await this.prisma.discount.delete({
            where: {
                id: Number(id)
            }
        })
        return { success: true }
    }
}

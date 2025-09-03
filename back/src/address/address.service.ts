import { BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create.address.dto';

@Injectable()
export class AddressService {
    constructor(private readonly prisma: PrismaService) { }
    async createAddress(req: Request, body: CreateAddressDto) {
        if (!req.user?.id) throw new BadRequestException('دوباره تلاش کنید')
        await this.prisma.address.create({
            data: {
                content: body.content,
                name: body.name,
                phone: body.phone,
                zipCode: body.zipCode,
                userId: req.user?.id,
            }
        })
        return { success: true }
    }

    async deleteAddress(id: string) {
        await this.prisma.address.delete({ where: { id: Number(id) } })
        return { success: true }
    }

    async updateAddress(id: string, body: CreateAddressDto) {
        await this.prisma.address.update({
            where: { id: Number(id) }, data: {
                content: body.content,
                name: body.name,
                phone: body.phone,
                zipCode: body.zipCode,
            }
        })
        return { success: true }
    }

    async getAddress(req: Request, id?: string) {
        if (!req.user?.id) throw new BadRequestException('دوباره تلاش کنید')
        if (id && req.user?.role !== "ADMIN") {
            throw new ForbiddenException('مجوز لازم را ندارید')
        }
        const data = await this.prisma.user.findUnique({ where: { id: id || req.user?.id }, select: { Address: true } })
        return data?.Address
    }
}
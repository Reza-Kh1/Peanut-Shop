import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntities } from 'src/auth/entities/auth.entities';
import { hashRefreshToken } from 'src/common/utils/hash.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SetCookie {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly configServices: ConfigService
    ) { }
    async setData(information: AuthEntities, res: Response, req: Request) {
        const hashToken = hashRefreshToken(uuidv4())
        const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
        const nameRefresh: string = this.configServices.get('jwt.refreshToken') || ''
        const nameAccess: string = this.configServices.get('jwt.accessToken') || ''
        const userAgent = req.headers['user-agent'];
        const { email, id, name, role } = information
        const jwt = this.jwtService.sign({ email, id, name, role })
        await this.prisma.token.create({
            data: {
                tokenHash: hashToken,
                userId: information.id,
                device: userAgent,
                ipAddress: ip
            }
        })
        res.cookie(nameRefresh, hashToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie(nameAccess, jwt, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 10 * 60 * 60 * 1000,
        });
        return information
    }

}

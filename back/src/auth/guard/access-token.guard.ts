import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException, HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { ConfigService } from '@nestjs/config';
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AuthEntities } from "../entities/auth.entities";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtServices: JwtService,
        private readonly reflector: Reflector,
        private readonly configServices: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const cookies = request.cookies as Record<string, string>
        const refreshToken = cookies?.refresh_token
        const accessToken = cookies?.access_token
        if (!refreshToken && !accessToken) {
            throw new UnauthorizedException('لطفا وارد حساب کاربری خود شوید');
        }

        try {
            const payload = await this.jwtServices.verifyAsync<AuthEntities>(accessToken, {
                secret: this.configServices.get('jwt.secret'),
            })
            request.user = payload
            return this.checkRoles(payload, context)
        } catch (error) {
            if (error instanceof HttpException || !cookies?.refresh_token) {
                throw error;
            } else {
                const data = await this.prisma.token.findUnique({
                    where: { tokenHash: cookies.refresh_token },
                    select: {
                        User: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                })
                if (data && data.User) {
                    this.checkRoles(data.User, context)
                    const name: string = this.configServices.get('jwt.accessToken') || ''
                    const jwt = this.jwtServices.sign(data.User)
                    request.user = data.User
                    response.cookie(name, jwt, {
                        httpOnly: false,
                        secure: true,
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 10 * 60 * 60 * 1000,
                    });
                    return true
                } else {
                    throw new UnauthorizedException('لطفا وارد حساب کاربری خود شوید');
                }
            }
        }
    }

    private checkRoles(user: { role?: string }, context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiredRoles && requiredRoles.length > 0 && user?.role) {
            const userRole = user?.role;
            if (!requiredRoles.includes(userRole)) {
                throw new ForbiddenException('مجوز لازم را ندارید');
            }
        }

        return true;
    }
}
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly jwtServices: JwtService,
        private readonly jwtConfigaration: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('لطفا وارد حساب کاربری خود شوید');
        }

        try {
            const payload = await this.jwtServices.verifyAsync(token, {
                secret: this.jwtConfigaration.get('jwt.secret'),
                // audience: this.jwtConfigaration.get('jwt.audience'),
                // issuer: this.jwtConfigaration.get('jwt.issuer'),
            });
            // request['user'] = payload;
            // console.log(payload);

        } catch (error) {
            throw new UnauthorizedException('لطفا وارد حساب کاربری خود شوید');
        }
        return true;
    }
    extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
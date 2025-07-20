// src/common/guards/roles.guard.ts

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

export interface JwtUser {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'AUTHOR';
}

export interface ExtendedRequest extends Request {
    user: JwtUser;
}


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest<ExtendedRequest>();
        const user = request.user;
        const test = request.headers as {
            authorization?: string
        }
        const gog = this.jwtService.verify("asdasdads")
        console.log(gog);

        if (!user || !requiredRoles.includes(user.role as Role)) {
            throw new ForbiddenException('شما اجازه دسترسی ندارید');
        }

        return true;
    }
}

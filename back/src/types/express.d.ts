import { AuthEntities } from 'src/auth/entities/auth.entities';

declare module 'express' {
    interface Request {
        user?: AuthEntities;
    }
}
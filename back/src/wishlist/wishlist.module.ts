import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';

@Module({
    imports: [AuthModule],
    providers: [WishlistService],
    controllers: [WishlistController]
})
export class WishlistModule { }

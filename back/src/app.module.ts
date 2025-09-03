import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModules } from './common/config/config.module';
import { AddressModule } from './address/address.module';
import { CategoryModule } from './category/category.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ProductPreviewModule } from './productPreview/productPreview.module';
import { ProductModule } from './product/product.module';
import { TagModule } from './tag/tag.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModules,
    AuthModule,
    UserModule,
    AddressModule,
    CategoryModule,
    TagModule,
    ProductPreviewModule,
    ProductModule,
    WishlistModule,
  ],
  // controllers: [AppController],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';


@Module({
    imports: [AuthModule],
    providers: [ProductService],
    controllers: [ProductController]
})
export class ProductModule { }

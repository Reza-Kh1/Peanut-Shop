import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ProductPreviewService } from './productPreview.service';
import { ProductPreviewController } from './productPreview.controller';


@Module({
    imports: [AuthModule],
    providers: [ProductPreviewService],
    controllers: [ProductPreviewController]
})
export class ProductPreviewModule { }

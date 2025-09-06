import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CommentProductService } from './commentProduct.service';
import { CommentProductController } from './commentProduct.controller';


@Module({
    imports: [AuthModule],
    providers: [CommentProductService],
    controllers: [CommentProductController]
})
export class CommentProductModule { }

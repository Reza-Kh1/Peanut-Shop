import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';


@Module({
    imports: [AuthModule],
    providers: [TagService],
    controllers: [TagController]
})
export class TagModule { }

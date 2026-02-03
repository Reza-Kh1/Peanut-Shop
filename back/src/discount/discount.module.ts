import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';


@Module({
    imports: [AuthModule],
    providers: [DiscountService],
    controllers: [DiscountController]
})
export class DiscountModule { }

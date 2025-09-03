import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    providers: [AddressService],
    controllers: [AddressController]
})
export class AddressModule { }

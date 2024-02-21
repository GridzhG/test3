import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {PaymentEntity} from "./payment.entity"
import {PaymentResolver} from "./payment.resolver"
import {PromocodeModule} from "../promocode/promocode.module"
import {UsersModule} from "../users/users.module"
import { PaymentController } from './payment.controller'
import {ConfigModule} from "../config/config.module"

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), PromocodeModule, UsersModule, ConfigModule],
  exports: [TypeOrmModule, PaymentService],
  providers: [PaymentService, PaymentResolver],
  controllers: [PaymentController]
})
export class PaymentModule {}

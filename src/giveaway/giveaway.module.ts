import {CacheModule, Module} from '@nestjs/common'
import { GiveawayService } from './giveaway.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {GiveawayEntity} from "./giveaway.entity"
import {GiveawayUsersEntity} from "./giveaway-users.entity"
import {ConfigModule} from "../config/config.module"
import {UsersModule} from "../users/users.module"
import {ItemsModule} from "../items/items.module"
import {PaymentModule} from "../payment/payment.module"
import {LiveDropsModule} from "../live-drops/live-drops.module"
import {GiveawayResolver} from "./giveaway.resolver"
import {ScheduleModule} from "@nestjs/schedule"

@Module({
  imports: [TypeOrmModule.forFeature([GiveawayEntity, GiveawayUsersEntity]), ConfigModule, UsersModule, ItemsModule, PaymentModule, LiveDropsModule, CacheModule.register(), ScheduleModule.forRoot()],
  exports: [TypeOrmModule, GiveawayService],
  providers: [GiveawayService, GiveawayResolver]
})
export class GiveawayModule {}

import {CacheModule, HttpModule, Logger, Module} from '@nestjs/common'
import { ItemsService } from './items.service'
import { ItemsController } from './items.controller'
import {TypeOrmModule} from "@nestjs/typeorm"
import {ItemEntity} from "./item.entity"
import {MarketCsgoModule} from "../market-csgo/market-csgo.module"
import {ItemsResolver} from "./items.resolver"

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity]), MarketCsgoModule, HttpModule, CacheModule.register()],
  exports: [TypeOrmModule, ItemsService],
  providers: [ItemsService, Logger, ItemsResolver],
  controllers: [ItemsController]
})
export class ItemsModule {}

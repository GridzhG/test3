import {CacheModule, Module} from '@nestjs/common'
import { BustService } from './bust.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {ConfigModule} from "../config/config.module"
import {LiveDropsModule} from "../live-drops/live-drops.module"
import {ItemsModule} from "../items/items.module"
import {UsersModule} from "../users/users.module"
import {BustEntity} from "./bust.entity"
import {BustResolver} from "./bust.resolver"

@Module({
  imports: [TypeOrmModule.forFeature([BustEntity]), ConfigModule, LiveDropsModule, ItemsModule, UsersModule, CacheModule.register()],
  exports: [TypeOrmModule, BustService],
  providers: [BustService, BustResolver]
})
export class BustModule {}

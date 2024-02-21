import {CacheModule, Module} from '@nestjs/common'
import { UpgradeService } from './upgrade.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {UpgradeEntity} from "./upgrade.entity"
import {LiveDropsModule} from "../live-drops/live-drops.module"
import {ItemsModule} from "../items/items.module"
import {UsersModule} from "../users/users.module"
import {ConfigModule} from "../config/config.module"
import {UpgradeResolver} from "./upgrade.resolver"

@Module({
  imports: [TypeOrmModule.forFeature([UpgradeEntity]), LiveDropsModule, ItemsModule, UsersModule, CacheModule.register(), ConfigModule],
  exports: [TypeOrmModule, UpgradeService],
  providers: [UpgradeService, UpgradeResolver]
})
export class UpgradeModule {}

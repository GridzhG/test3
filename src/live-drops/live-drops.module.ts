import {CacheModule, forwardRef, Module} from '@nestjs/common'
import { LiveDropsService } from './live-drops.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {LiveDropEntity} from "./live-drop.entity"
import {LiveDropsResolver} from "./live-drops.resolver"
import {RedisClientModule} from "../redis-client/redis-client.module"
import {UsersModule} from "../users/users.module"
import {MarketCsgoModule} from "../market-csgo/market-csgo.module"
import {WithdrawEntity} from "./withdraw.entity"
import {ScheduleModule} from "@nestjs/schedule"
import {SocketGateway} from "../socket/socket.gateway"
import {ConfigModule} from "../config/config.module"

@Module({
  imports: [TypeOrmModule.forFeature([LiveDropEntity, WithdrawEntity]), ConfigModule, RedisClientModule, forwardRef(() => UsersModule), CacheModule.register(), MarketCsgoModule, ScheduleModule.forRoot()],
  exports: [TypeOrmModule, LiveDropsService, LiveDropsResolver],
  providers: [LiveDropsService, LiveDropsResolver, SocketGateway]
})
export class LiveDropsModule {}

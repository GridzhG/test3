import {CacheModule, forwardRef, Module} from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import {RedisClientModule} from "../redis-client/redis-client.module"
import {TypeOrmModule} from "@nestjs/typeorm"
import {UserEntity} from "./user.entity"
import {UsersResolver} from "./users.resolver"
import {LiveDropsModule} from "../live-drops/live-drops.module"
import {ConfigModule} from "../config/config.module"

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity]),
      RedisClientModule,
      CacheModule.register(),
      forwardRef(() => LiveDropsModule),
      ConfigModule
  ],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver]
})
export class UsersModule {}

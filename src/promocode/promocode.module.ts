import {CacheModule, Module} from '@nestjs/common'
import { PromocodeService } from './promocode.service'
import {PromocodeResolver} from "./promocode.resolver"
import {TypeOrmModule} from "@nestjs/typeorm"
import {PromocodeEntity} from "./promocode.entity"
import {PromocodeUseEntity} from "./promocode-use.entity"
import {UsersModule} from "../users/users.module"

@Module({
  imports: [TypeOrmModule.forFeature([PromocodeEntity, PromocodeUseEntity]), UsersModule, CacheModule.register()],
  exports: [TypeOrmModule, PromocodeService],
  providers: [PromocodeService, PromocodeResolver]
})
export class PromocodeModule {}

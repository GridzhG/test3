import { Module, forwardRef } from '@nestjs/common'
import { CaseItemsService } from './case-items.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {CaseItemEntity} from "./case-item.entity"
import {RedisClientModule} from "../redis-client/redis-client.module"
import {CasesModule} from "../cases/cases.module"

@Module({
  imports: [
      TypeOrmModule.forFeature([CaseItemEntity]),
      RedisClientModule,
      forwardRef(() => CasesModule)
  ],
  exports: [TypeOrmModule, CaseItemsService],
  providers: [CaseItemsService]
})
export class CaseItemsModule {}

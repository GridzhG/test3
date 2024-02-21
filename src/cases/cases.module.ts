import {CacheModule, forwardRef, Module} from '@nestjs/common'
import { CasesService } from './cases.service'
import { CasesController } from './cases.controller'
import {TypeOrmModule} from "@nestjs/typeorm"
import {CaseEntity} from "./case.entity"
import {CategoriesModule} from "../categories/categories.module"
import {CaseItemsModule} from "../case-items/case-items.module"
import {CasesResolver} from "./cases.resolver"
import {LiveDropsModule} from "../live-drops/live-drops.module"
import {UsersModule} from "../users/users.module"

@Module({
  imports: [
      TypeOrmModule.forFeature([CaseEntity]),
      CategoriesModule,
      CaseItemsModule,
      CacheModule.register(),
      forwardRef(() => LiveDropsModule),
      UsersModule
  ],
  exports: [TypeOrmModule, CasesService],
  providers: [CasesService, CasesResolver],
  controllers: [CasesController]
})
export class CasesModule {}

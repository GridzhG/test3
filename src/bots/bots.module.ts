import { Module } from '@nestjs/common'
import { BotsService } from './bots.service'
import {UsersModule} from "../users/users.module"
import {BustModule} from "../bust/bust.module"
import {UpgradeModule} from "../upgrade/upgrade.module"
import {CasesModule} from "../cases/cases.module"

@Module({
  imports: [UsersModule, BustModule, UpgradeModule, CasesModule],
  providers: [BotsService]
})
export class BotsModule {}

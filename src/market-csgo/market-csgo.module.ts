import { Module } from '@nestjs/common'
import { MarketCsgoService } from './market-csgo.service'
import {AppService} from "../app.service"
import {ConfigModule} from "../config/config.module"

@Module({
  imports: [ConfigModule],
  exports: [MarketCsgoService],
  providers: [MarketCsgoService]
})
export class MarketCsgoModule {}

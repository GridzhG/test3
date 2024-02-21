import { Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import {TypeOrmModule} from "@nestjs/typeorm"
import {SettingEntity} from "./setting.entity"

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  exports: [TypeOrmModule, ConfigService],
  providers: [ConfigService]
})
export class ConfigModule {}

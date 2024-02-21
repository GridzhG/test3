import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from "@nestjs/jwt"
import { default as config } from 'config.json'
import {SteamStrategy} from "./steam.strategy"
import {JwtStrategy} from "./jwt.strategy"
import {UsersModule} from "../users/users.module"

@Module({
  imports: [
    UsersModule,  
    JwtModule.register({
      secret: config.jwt.key,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SteamStrategy]
})
export class AuthModule {}

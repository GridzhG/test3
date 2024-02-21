import { Injectable } from '@nestjs/common'
import {JwtService} from "@nestjs/jwt"
import {UsersService} from "../users/users.service"

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {
    }

    async validateUser(profile: any): Promise<any> {
        return await this.usersService.findOrCreate(profile._json)
    }

    async logIn(user: any): Promise<string> {
        const payload = {
            sub: user.id,
            steamId: user.steamId
        }

        return this.jwtService.sign(payload)
    }
}

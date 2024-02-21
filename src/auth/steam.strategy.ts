import { Strategy } from 'passport-steam'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'
import { default as config } from 'config.json'

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            returnURL: `${config.cors.auth_url}/api/auth/steam/return`,
            realm: `${config.cors.auth_url}`,
            apiKey: config.steam.key
        })
    }

    async validate(identifier, profile): Promise<any> {
        return await this.authService.validateUser(profile)
    }
}

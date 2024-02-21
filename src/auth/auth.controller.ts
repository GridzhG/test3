import {Controller, Get, UseGuards, Req, Res} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {AuthService} from "./auth.service"
import { default as config } from 'config.json'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @UseGuards(AuthGuard('steam'))
    @Get('steam')
    async login(): Promise<void> {
        return
    }

    @UseGuards(AuthGuard('steam'))
    @Get('steam/return')
    async handler(@Req() req, @Res() res): Promise<string> {
        const accessToken = await this.authService.logIn(req.user)

        res.redirect(`${config.cors.frontend_url}/auth/steam?token=${accessToken}`)

        return accessToken
    }
}

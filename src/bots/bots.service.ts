import { Injectable } from '@nestjs/common'
import {UsersService} from "../users/users.service"
import {BustService} from "../bust/bust.service"
import {CasesService} from "../cases/cases.service"
import {UpgradeService} from "../upgrade/upgrade.service"
import {randomInt} from "crypto"

@Injectable()
export class BotsService {
    constructor(
        private usersService: UsersService,
        private bustService: BustService,
        private upgradeService: UpgradeService,
        private casesService: CasesService
    ) {
    }
    
    async onApplicationBootstrap() {
        // this.startBots()
    }

    async startBots() {
        setInterval(async () => {
            const game = randomInt(1, 100)
            const user = await this.usersService.getRandomBot()

            if (game < 70) {
                this.casesService.startBotGame(user)
            } else if (game > 70 && game <= 85) {
                this.upgradeService.startBotGame(user)
            } else if (game > 85 && game <= 100) {
                this.bustService.startBotGame(user)
            }
        }, randomInt(10000, 40000))
    }
}

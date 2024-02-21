import {HttpException, Injectable} from '@nestjs/common'
import {UserEntity} from "../users/user.entity"
import {LiveDropsService} from "../live-drops/live-drops.service"
import {ItemsService} from "../items/items.service"
import {ConfigService} from "../config/config.service"
import {InjectRepository} from "@nestjs/typeorm"
import {BustEntity} from "./bust.entity"
import {Repository} from "typeorm"
import {UsersService} from "../users/users.service"
import {randomInt} from "crypto"

@Injectable()
export class BustService {
    constructor(
        private liveDropService: LiveDropsService,
        private itemsService: ItemsService,
        private configService: ConfigService,
        @InjectRepository(BustEntity)
        private bustRepository: Repository<BustEntity>,
        private userService: UsersService
    ) {
    }

    async create(items: any, user: UserEntity) {
        let price = 0

        const newItems = []

        for (const item of items) {
            const drop = await this.liveDropService.getDropById(item)

            if (!drop || drop.status !== 0) {
                throw new HttpException('Один из предметов не найден в инвентаре', 400)
            }

            price += drop.item.price
            newItems.push(drop)
        }

        if (price < 10) {
            throw new HttpException('Минимальная сумма буста: 10₽', 400)
        }

        if (price > 20000) {
            throw new HttpException('Максимальная сумма буста: 20000₽', 400)
        }

        const min = price / 4
        const max = price * 4

        const bank = parseFloat(this.configService.settings.bank_contracts)
        const profitContracts = parseFloat(this.configService.settings.profit_contracts)
        const percent = parseFloat(this.configService.settings.percent_contracts)

        let newBank = bank

        if (price > bank) {
            newBank = price
        }

        if (bank > max) {
            newBank = max
        }

        const winItem = await this.itemsService.getItemByPrice(randomInt(parseInt(String(min)), parseInt(String(newBank))))

        const profit = price - winItem.price
        const toBank = profit * (percent / 100)

        this.configService.settings.bank_contracts = bank + toBank
        this.configService.settings.profit_contracts = profitContracts + (profit - toBank)
        this.configService.updateSettings(this.configService.settings)

        newItems.map(async (v) => {
            v.status = 5
            await this.liveDropService.updateItem(v)
        })

        const drop = await this.liveDropService.createLiveDrop({
            user_id: user.id,
            item_id: winItem.id,
            price: winItem.price,
            type: 'contracts'
        })

        this.bustRepository.save(
            this.bustRepository.create({
                user_id: user.id,
                items: JSON.stringify(newItems),
                sum: price,
                winItem: JSON.stringify(winItem)
            })
        )

        this.liveDropService.updateLiveDrop()

        user.contracts += 1
        user.profit += (winItem.price - price)
        this.userService.save(user)

        winItem.id = drop.id

        return winItem
    }

    async getBustByUserId(userId) {
        return await this.bustRepository.find({
            where: {
                user_id: userId
            }
        })
    }

    async startBotGame(user) {
        const cntUserItems = randomInt(3, 10)
        const items = []
        let price = 0

        for (let i = 0; i < cntUserItems; i++) {
            const item = await this.itemsService.getRandomItemByPrice(1, 1000)

            const drop = await this.liveDropService.createLiveDrop({
                user_id: user.id,
                item_id: item.id,
                price: item.price,
                type: 'contracts',
                invisible: 1
            })

            drop.item = item

            price += item.price
            items.push(drop)
        }

        const min = price / 4
        const max = price * 4

        const winItem = await this.itemsService.getItemByPrice(randomInt(parseInt(String(min)), parseInt(String(max))))

        items.map(async (v) => {
            v.status = 5
            await this.liveDropService.updateItem(v)
        })

        await this.liveDropService.createLiveDrop({
            user_id: user.id,
            item_id: winItem.id,
            price: winItem.price,
            type: 'contracts',
            status: 1
        })

        this.bustRepository.save(
            this.bustRepository.create({
                user_id: user.id,
                items: JSON.stringify(items),
                sum: price,
                winItem: JSON.stringify(winItem)
            })
        )

        user.contracts += 1
        this.userService.save(user)

        this.liveDropService.updateLiveDrop()
    }
}

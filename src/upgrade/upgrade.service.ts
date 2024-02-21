import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common'
import {LiveDropsService} from "../live-drops/live-drops.service"
import {UsersService} from "../users/users.service"
import {ItemsService} from "../items/items.service"
import {InjectRepository} from "@nestjs/typeorm"
import {UpgradeEntity} from "./upgrade.entity"
import {Repository} from "typeorm"
import {randomInt} from "crypto"
import {UserEntity} from "../users/user.entity"
import {ConfigService} from "../config/config.service"

@Injectable()
export class UpgradeService {
    constructor(
        private liveDropService: LiveDropsService,
        private usersService: UsersService,
        private itemsService: ItemsService,
        private configService: ConfigService,
        @InjectRepository(UpgradeEntity)
        private upgradeRepository: Repository<UpgradeEntity>,
        @Inject(CACHE_MANAGER)
        private cacheManager,
    ) {
    }

    async upgrade(user: UserEntity, myItem, siteItem) {
        if (typeof await this.cacheManager.get(`upgrade_${user.id}`) !== 'undefined') {
            throw 'Не так часто'
        }

        this.cacheManager.set(`upgrade_${user.id}`, 1, {ttl: 5})

        let mItem = null

        if (myItem !== null) {
            mItem = await this.liveDropService.getDropById(myItem)
        }

        const sItem = await this.itemsService.findById(siteItem)

        if (!sItem) {
            throw 'Предмет для апгрейда не найден'
        }

        if (!mItem) {
            throw 'Предмет не найден в вашем инвентаре'
        }

        const chance = (mItem.price / sItem.price) * 100

        if (chance > 75) {
            throw 'Выберите другие предметы'
        }

        mItem.status = 4
        await this.liveDropService.updateItem(mItem)

        const bank = parseFloat(this.configService.settings.bank_upgrades)
        const profitUpgrades = parseFloat(this.configService.settings.profit_upgrades)
        const percent = parseFloat(this.configService.settings.percent_upgrades)

        let win = sItem.price - mItem.price, random = randomInt(1, 100)

        if (win > bank) {
            random = 100
        }

        let winItem

        const createUpgrade = await this.upgradeRepository.create({
            user_id: user.id,
            item: mItem.item
        })

        if (chance > random) {
            winItem = sItem
        } else {
            winItem = await this.itemsService.getRandomItemByPrice(1, mItem.price)
        }

        const drop = await this.liveDropService.createLiveDrop({
            user_id: user.id,
            item_id: winItem.id,
            price: winItem.price,
            type: 'upgrade'
        })

        winItem.id = drop.id

        createUpgrade.winItem = winItem

        this.liveDropService.updateLiveDrop()
        this.upgradeRepository.save(createUpgrade)

        let toBank

        if (winItem) {
            toBank = mItem.price - winItem.price
        } else {
            win = mItem.price
            toBank = mItem.price * (percent / 100)

            this.configService.settings.profit_upgrades = profitUpgrades + (win - toBank)
        }

        this.configService.settings.bank_upgrades = bank + toBank
        this.configService.updateSettings(this.configService.settings)

        user.upgrades += 1
        this.usersService.save(user)

        return winItem
    }

    async getUpgradesByUserId(userId) {
        return await this.upgradeRepository.find({
            where: {
                user_id: userId
            }
        })
    }

    async startBotGame(user) {
        const item = await this.itemsService.getRandomItemByPrice(1, 1000)

        if (!item) {
            return
        }

        const mItem = await this.liveDropService.createLiveDrop({
            user_id: user.id,
            item_id: item.id,
            price: item.price,
            type: 'contracts',
            invisible: 1
        })

        mItem.item = item

        const sItem = await this.itemsService.getRandomItemByPrice(item.price * 1.35, item.price * 10)

        if (!sItem) {
            return
        }

        const chance = (mItem.price / sItem.price) * 100

        if (chance > 75) {
            return
        }

        mItem.status = 4
        await this.liveDropService.updateItem(mItem)

        const random = randomInt(1, 100)
        let winItem

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const createUpgrade = await this.upgradeRepository.create({
            user_id: user.id,
            item: mItem.item
        })

        if (chance > random) {
            winItem = sItem
        } else {
            winItem = await this.itemsService.getRandomItemByPrice(1, mItem.price)
        }

        const drop = await this.liveDropService.createLiveDrop({
            user_id: user.id,
            item_id: winItem.id,
            price: winItem.price,
            type: 'upgrade',
            status: 1
        })

        winItem.id = drop.id

        createUpgrade.winItem = winItem

        user.upgrades += 1
        this.usersService.save(user)

        this.liveDropService.updateLiveDrop()
        this.upgradeRepository.save(createUpgrade)
    }
}

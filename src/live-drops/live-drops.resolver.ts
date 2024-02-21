import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql"
import {CACHE_MANAGER, HttpException, Inject, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {LiveDropsService} from "./live-drops.service"
import {UserEntity} from "../users/user.entity"
import {Drop} from "./models/drop.model"
import {UsersService} from "../users/users.service"
import { default as config } from 'config.json'
import {MarketCsgoService} from "../market-csgo/market-csgo.service"
import {InjectRepository} from "@nestjs/typeorm"
import {Raw, Repository} from "typeorm"
import {WithdrawEntity} from "./withdraw.entity"
import {Cron, CronExpression} from "@nestjs/schedule"
import {SocketGateway} from "../socket/socket.gateway"
import { LiveDrop } from "./models/livedrop.model"
import datef from 'datef'
import {ConfigService} from "../config/config.service";

@Resolver(of => Drop)
export class LiveDropsResolver {
    constructor(
        @InjectRepository(WithdrawEntity)
        private withdrawRepository: Repository<WithdrawEntity>,
        private liveDropsService: LiveDropsService,
        private usersService: UsersService,
        @Inject(CACHE_MANAGER)
        private cacheManager,
        private marketCsgoService: MarketCsgoService,
        private socketGateway: SocketGateway,
        private configService: ConfigService
    ) {
    }

    @Query(returns => LiveDrop)
    async getLiveDrop(@CurrentUser() user: UserEntity) {
        return await this.liveDropsService.getLiveDropAll()
    }

    @Query(returns => [Drop])
    @UseGuards(GqlAuthGuard)
    async userInventory(@CurrentUser() user: UserEntity) {
        return await this.liveDropsService.findAllByUserId(user.id)
    }

    @Query(returns => [Drop])
    @UseGuards(GqlAuthGuard)
    async userInventoryInGame(@CurrentUser() user: UserEntity) {
        let inventory = await this.liveDropsService.findAllByUserId(user.id)

        inventory = inventory.filter(i => i.status === 0)

        inventory = inventory.sort((a, b) => {
            if (a.item.price > b.item.price) {
                return -1
            }

            if (a.item.price < b.item.price) {
                return 1
            }

            return 0
        })

        return inventory
    }

    @Query(returns => [Drop])
    async userInventoryById(
        @Args('id', { type: () => Int }) id: number
    ) {
        return await this.liveDropsService.findAllByUserId(id)
    }

    @Mutation(returns => String)
    @UseGuards(GqlAuthGuard)
    async userInventorySellItems(
        @CurrentUser() user: UserEntity,
        @Args('ids', { type: () => [Int] }) ids: any
    ) {
        const items = []
        let price = 0

        await Promise.all(ids.map(async (id) => {
            const drop = await this.liveDropsService.getDropById(id)

            if (!drop || drop.user_id !== user.id || drop.status !== 0) {
                throw new HttpException('Один из предметов не найден в инвентаре', 400)
            }

            price += drop.item.price

            items.push(drop)
        }))

        await Promise.all(items.map(async (drop) => {
            drop.status = 1
            await this.liveDropsService.save(drop)
        }))

        user.balance += price
        await this.usersService.save(user)

        return price.toString()
    }

    @Mutation(returns => Boolean)
    @UseGuards(GqlAuthGuard)
    async userInventoryWithdrawItem(
        @CurrentUser() user: UserEntity,
        @Args('id', { type: () => Int }) id: any
    ) {
        if (typeof await this.cacheManager.get(`withdraw_${user.id}`) !== 'undefined') {
            throw new HttpException('Не так часто', 400)
        }

        this.cacheManager.set(`withdraw_${user.id}`, 1, {ttl: 10})

        if (user.trade_url === null) {
            throw new HttpException('Введите ссылку на обмен', 400)
        }

        const drop = await this.liveDropsService.getDropById(id)

        if (!drop || drop.user_id !== user.id || drop.status !== 0) {
            throw new HttpException('Предмет не найден в инвентаре', 400)
        }

        drop.status = 2
        await this.liveDropsService.save(drop)

        const withdraw = await this.withdrawRepository.save(
            this.withdrawRepository.create({
                user_id: user.id,
                item_id: drop.item_id,
                live_id: drop.id
            })
        )

        try {
            const marketItem = await this.marketCsgoService.searchItemByHashName(drop.item)

            const price = marketItem.price / 100
            withdraw.price = price

            if ((drop.item.price * this.configService.config.market_csgo.max_buy_percent) < price) {
                throw new HttpException('Завышенный ценник на покупку', 400)
            }

            const buyItem = await this.marketCsgoService.buyItem(marketItem, user)

            withdraw.custom_id = buyItem.custom_id
            await this.withdrawRepository.save(withdraw)

            return true
        } catch (e) {
            withdraw.status = 2
            withdraw.error_msg = e
            await this.withdrawRepository.save(withdraw)

            drop.status = 0
            await this.liveDropsService.save(drop)

            throw new HttpException('Предмет не найден в магазине', 400)
        }
    }

    async updateSocketStatus(live) {
        this.socketGateway.socket.emit('updateItemStatus', {
            id: live.id,
            user_id: live.user_id,
            status: live.status,
            trade_id: live.trade_id
        })
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async getStatusMarket() {
        const withdraws = await this.withdrawRepository.find({
            where: {
                status: 0,
                custom_id: Raw(alias => `${alias} IS NOT NULL`)
            }
        })

        const customIds = []

        for (const withdraw of withdraws) {
            customIds.push(withdraw.custom_id)
        }

        const trades = await this.marketCsgoService.getTradeByCustomIds(customIds)

        for (const customId in trades) {
            const trade = trades[customId]
            const withdraw = await this.withdrawRepository.findOne({
                relations: ['item', 'user', 'live'],
                where: {
                    custom_id: customId
                }
            })

            if (withdraw) {
                if (trade.stage === '1' && trade.trade_id > 0) {
                    withdraw.live.trade_id = trade.trade_id
                    await this.liveDropsService.save(withdraw.live)

                    await this.updateSocketStatus(withdraw.live)
                }

                if (trade.stage === '2') {
                    withdraw.status = 1
                    await this.withdrawRepository.save(withdraw)

                    withdraw.live.status = 3
                    await this.liveDropsService.save(withdraw.live)

                    await this.updateSocketStatus(withdraw.live)
                }

                if (trade.stage === '5') {
                    withdraw.status = 2
                    withdraw.error_msg = 'Отменен/не отправлен'
                    await this.withdrawRepository.save(withdraw)

                    withdraw.live.status = 0
                    withdraw.live.trade_id = null
                    await this.liveDropsService.save(withdraw.live)

                    await this.updateSocketStatus(withdraw.live)
                }
            }
        }
    }

    async getWithdrawStatistic() {
        const today = new Date()
        today.setHours(0,0,0,0)

        const d = new Date(),
            day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1),
            week = new Date(d.setDate(diff))

        week.setHours(0,0,0,0)

        const date = new Date(),
            month = new Date(date.getFullYear(), date.getMonth(), 1)

        month.setHours(0,0,0,0)

        return {
            daily: await this.getWithdrawStatisticByDate(today),
            weekly: await this.getWithdrawStatisticByDate(week),
            monthly: await this.getWithdrawStatisticByDate(month),
            all: await this.getWithdrawStatisticByDate(new Date(1))
        }
    }

    async getWithdrawStatisticByDate(date: Date): Promise<number> {
        const sum = await this.withdrawRepository.createQueryBuilder('withdraw')
            .select('SUM(price)', 'sum')
            .where(`status = 1 AND created_at >= :date`, {date})
            .getRawOne()

        return sum.sum === null ? 0.00 : sum.sum.toFixed(2)
    }

    async getLastWithdraws(limit = 20): Promise<any> {
        const withdraws = await this.withdrawRepository.find({
            relations: ['user', 'item'],
            where: {
                status: 1
            },
            order: {
                id: 'DESC'
            },
            take: limit
        })

        return withdraws.map((withdraw) => {
            return {
                id: withdraw.id,
                user: {
                    id: withdraw.user.id,
                    username: withdraw.user.username,
                    avatar: withdraw.user.avatar
                },
                item: {
                    id: withdraw.item.id,
                    market_hash_name: withdraw.item.market_hash_name
                },
                created_at: datef('HH:mm dd.MM.YYYY', withdraw.created_at)
            }
        })
    }

    async getWithdraws(data): Promise<WithdrawEntity[]> {
        const queryBuilder = this.withdrawRepository.createQueryBuilder('withdraw')
        queryBuilder.leftJoinAndSelect("withdraw.user", "user")
        queryBuilder.leftJoinAndSelect("withdraw.item", "item")
        queryBuilder.orderBy(`withdraw.${data.columnName}`, data.columnSortOrder.toUpperCase())
        queryBuilder.where(
            `withdraw.user_id LIKE '%${data.searchValue}%' OR withdraw.item_id LIKE '%${data.searchValue}%'`
        )
        queryBuilder.limit(data.length)
        queryBuilder.offset(data.row)

        return queryBuilder.getMany()
    }

    async getCountWithdraws(): Promise<number> {
        const sum = await this.withdrawRepository.createQueryBuilder()
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }

    async getWithdrawById(id: number): Promise<WithdrawEntity> {
        return await this.withdrawRepository.findOne({
            relations: ['item'],
            where: {
                id: id
            }
        })
    }

    async getWithdrawByUserId(id: number): Promise<WithdrawEntity[]> {
        return await this.withdrawRepository.find({
            relations: ['item'],
            where: {
                user_id: id
            }
        })
    }

    async saveWithdraw(withdraw: WithdrawEntity): Promise<WithdrawEntity> {
        return await this.withdrawRepository.save(withdraw)
    }
}
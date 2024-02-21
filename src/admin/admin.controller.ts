import {Body, Controller, Get, HttpException, Param, Post, Query, UseGuards} from '@nestjs/common'
import {JwtAuthGuard} from "../guards/jwt-auth.guard"
import {AdminOrModeratorGuard} from "../guards/admin-or-moderator.guard"
import {PaymentService} from "../payment/payment.service"
import {UsersService} from "../users/users.service"
import {ItemsService} from "../items/items.service"
import {LiveDropsService} from "../live-drops/live-drops.service"
import {parseDataTableQuery} from "../utils"
import {LiveDropsResolver} from "../live-drops/live-drops.resolver"
import {ConfigService} from "../config/config.service"
import {PromocodeService} from "../promocode/promocode.service"
import {BustService} from "../bust/bust.service"
import {UpgradeService} from "../upgrade/upgrade.service"

@Controller('admin')
export class AdminController {
    constructor(
        private paymentService: PaymentService,
        private usersService: UsersService,
        private itemsService: ItemsService,
        private liveDropsService: LiveDropsService,
        private liveDropsResolver: LiveDropsResolver,
        private configService: ConfigService,
        private promocodeService: PromocodeService,
        private bustService: BustService,
        private upgradeService: UpgradeService
    ) {
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('statistic')
    async getStatistic(): Promise<any> {
        return {
            statistic: {
                payments: await this.paymentService.getPaymentStatistic(),
                withdraws: await this.liveDropsResolver.getWithdrawStatistic(),
                users: await this.usersService.getRegistrationStatistic(),
                usersRegistrations: await this.usersService.getLastRegistrations(),
                lastWithdraws: await this.liveDropsResolver.getLastWithdraws(),
                lastPayments: await this.paymentService.getLastPayments(),
            }
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('config')
    async getConfig(): Promise<any> {
        return this.configService.config
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('config/save')
    async saveConfig(@Body() body): Promise<any> {
        body.config.referral.to_balance = parseFloat(body.config.referral.to_balance)
        body.config.payment.max = parseFloat(body.config.payment.max)
        body.config.payment.min = parseFloat(body.config.payment.min)
        body.config.market_csgo.max_buy_percent = parseFloat(body.config.market_csgo.max_buy_percent)

        await this.configService.update(body.config)

        return true
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('users')
    async getUsers(@Query() query): Promise<any> {
        const { draw, row, length, columnName, columnSortOrder, searchValue } = await parseDataTableQuery(query)

        const users = await this.usersService.getUsers(
            {
                columnName,
                columnSortOrder,
                searchValue,
                row,
                length
            })

        const usersAll = await this.usersService.getCountAllUsers()

        return {
            draw,
            data: users,
            recordsTotal: usersAll,
            recordsFiltered: usersAll
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('payments')
    async getPayments(@Query() query): Promise<any> {
        const { draw, row, length, columnName, columnSortOrder, searchValue } = await parseDataTableQuery(query)

        const payments = await this.paymentService.getPayments(
            {
                columnName,
                columnSortOrder,
                searchValue,
                row,
                length
            })

        const paymentsAll = await this.paymentService.getCountAllPayments()

        return {
            draw,
            data: payments,
            recordsTotal: paymentsAll,
            recordsFiltered: paymentsAll
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('opens_users/:id')
    async openUsers(@Query() query, @Param('id') id): Promise<any> {
        const { draw, row, length, columnName, columnSortOrder, searchValue } = await parseDataTableQuery(query)

        const opens = await this.liveDropsService.getOpens(
            {
                columnName,
                columnSortOrder,
                searchValue,
                row,
                length,
            }, id)

        const opensAll = await this.liveDropsService.getCountOpens(id)

        return {
            draw,
            data: opens,
            recordsTotal: opensAll,
            recordsFiltered: opensAll
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('user/:id')
    async getUser(@Param('id') id): Promise<any> {
        const user = await this.usersService.findById(id)

        if (!user) {
            throw new HttpException('Пользователь не найден', 400)
        }

        const info = {
            withdraws: await this.liveDropsResolver.getWithdrawByUserId(user.id),
            payments: await this.paymentService.getPaymentsByUserId(user.id),
            contracts: await this.bustService.getBustByUserId(user.id),
            upgrades: await this.upgradeService.getUpgradesByUserId(user.id)
        }

        return {
            user,
            info
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('user/:id')
    async saveUser(@Param('id') id, @Body() body): Promise<any> {
        const user = await this.usersService.findById(id)

        if (!user) {
            throw new HttpException('Пользователь не найден', 400)
        }

        if (typeof body.user.bestDrop !== 'undefined') {
            delete body.user.bestDrop
        }

        await this.usersService.updateByRandomData(user.id, body.user)

        return {
            success: true
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('findItemsInInventory')
    async findItemsInInventory(@Query() query): Promise<any> {
        const { search, page } = query

        let items = await this.itemsService.findItems(search, page, 20)

        items = items.map((item) => {
            return {
                id: item.id,
                img: `https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}/32x32`,
                text: `${item.market_hash_name} (${item.price.toFixed(2)}Р)`
            }
        })

        return {
            results: items,
            more: true
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('promocodes')
    async getPromocodes(@Query() query): Promise<any> {
        const { draw, row, length, columnName, columnSortOrder, searchValue } = await parseDataTableQuery(query)

        let promocodes = await this.promocodeService.getPromocodes(
            {
                columnName,
                columnSortOrder,
                searchValue,
                row,
                length
            })

        const promocodesAll = await this.promocodeService.getCountAllPromocodes()

        promocodes = await Promise.all(promocodes.map(async (promocode: any) => {
            promocode.used = Number(await this.promocodeService.getCountUsedPromoByName(promocode.id))

            return promocode
        }))

        return {
            draw,
            data: promocodes,
            recordsTotal: promocodesAll,
            recordsFiltered: promocodesAll
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('promocodes/create')
    async createPromocode(@Body() body): Promise<any> {
        try {
            await this.promocodeService.createPromocode(body.item)

            return true
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('promocodes/:id/del')
    async promocodeDelete(@Param('id') id): Promise<any> {
        try {
            await this.promocodeService.deletePromocode(id)

            return true
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('promocodes/:id/info')
    async getPromocodeInfo(@Param('id') id): Promise<any> {
        try {
            return await this.paymentService.getInfoByPromocode(id)
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('bots')
    async getFakeUsers(@Query() query): Promise<any> {
        const { draw, row, length, columnName, columnSortOrder, searchValue } = await parseDataTableQuery(query)

        const users = await this.usersService.getFakeUsers(
            {
                columnName,
                columnSortOrder,
                searchValue,
                row,
                length
            })

        const usersAll = await this.usersService.getCountAllFakeUsers()

        return {
            draw,
            data: users,
            recordsTotal: usersAll,
            recordsFiltered: usersAll
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Get('findBots')
    async findBots(@Query() query): Promise<any> {
        const { search, page } = query

        let bots = await this.usersService.findBots(search, page, 20)

        bots = bots.map((bot) => {
            return {
                id: bot.id,
                text: `${bot.username}`
            }
        })

        let more = true

        if (bots.length < 20) {
            more = false
        }

        return {
            results: bots,
            more
        }
    }

    @UseGuards(JwtAuthGuard, AdminOrModeratorGuard)
    @Post('bots/create')
    async createBot(@Body() body): Promise<any> {
        const { steamId } = body

        try {
            await this.usersService.createBot(steamId)

            return {
                success: true
            }
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}

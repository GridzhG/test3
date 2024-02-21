import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {GiveawayEntity} from "./giveaway.entity"
import {GiveawayUsersEntity} from "./giveaway-users.entity"
import {Repository} from "typeorm"
import {ConfigService} from "../config/config.service"
import {ItemsService} from "../items/items.service"
import {UsersService} from "../users/users.service"
import {PaymentService} from "../payment/payment.service"
import {LiveDropsService} from "../live-drops/live-drops.service"
import {Cron, CronExpression} from "@nestjs/schedule"

@Injectable()
export class GiveawayService {
    public giveaways: any

    constructor(
        @InjectRepository(GiveawayEntity)
        private giveawayRepository: Repository<GiveawayEntity>,
        @InjectRepository(GiveawayUsersEntity)
        private giveawayUsersRepository: Repository<GiveawayUsersEntity>,
        private configService: ConfigService,
        private itemService: ItemsService,
        private paymentService: PaymentService,
        private userService: UsersService,
        private liveDropService: LiveDropsService,
        @Inject(CACHE_MANAGER)
        private cacheManager,
    ) {
        this.giveaways = []
    }

    async onApplicationBootstrap() {
        this.giveaways = await this.getGiveaways()
    }

    async getGiveaways() {
        return await this.giveawayRepository.find({
            relations: ['item'],
            where: {
                status: 0
            },
            order: {
                id: 'DESC'
            }
        })
    }

    async joinGiveaway(user, id) {
        if (typeof await this.cacheManager.get(`join_giveaway_${user.id}`) !== 'undefined') {
            throw 'Не так часто'
        }

        this.cacheManager.set(`join_giveaway_${user.id}`, 1, {ttl: 5})

        const giveaway = await this.giveawayRepository.findOne({
            where: {
                id: id,
                status: 0
            }
        })

        if (!giveaway) {
            throw 'Раздача закончилась'
        }

        const joined = await this.giveawayUsersRepository.findOne({
            where: {
                user_id: user.id,
                giveaway_id: giveaway.id
            }
        })

        if (joined) {
            throw 'Вы уже участвуете в раздаче'
        }

        const d = new Date()
        d.setDate(d.getDate() - 1)
        
        const payed = await this.paymentService.getPaymentHour(user.id, d)

        if (payed < giveaway.deposit_need) {
            throw `Чтобы участвовать в розыгрыше Вы должны пополнить ${giveaway.deposit_need - payed}₽ за последние сутки`
        }

        giveaway.members += 1
        await this.giveawayRepository.save(giveaway)

        await this.giveawayUsersRepository.save(
            this.giveawayUsersRepository.create({
                user_id: user.id,
                giveaway_id: giveaway.id
            })
        )

        this.giveaways = this.getGiveaways()

        return true
    }

    async setWinner(v) {
        const giveaway = await this.giveawayRepository.findOne({
            relations: ['item'],
            where: {
                id: v.id
            }
        })

        const randomBet = await this.giveawayUsersRepository.createQueryBuilder('bet')
            .innerJoinAndSelect("bet.user", "user")
            .where(`giveaway_id = ${giveaway.id}`)
            .orderBy('RAND()')
            .limit(1)
            .execute()

        const winnerBet = randomBet[0]

        giveaway.winner_id = winnerBet.bet_user_id
        giveaway.status = 1
        await this.giveawayRepository.save(giveaway)

        await this.liveDropService.createLiveDrop({
            user_id: winnerBet.bet_user_id,
            item_id: giveaway.item.id,
            price: giveaway.item.price,
            type: 'giveaway'
        })

        this.giveaways = await this.getGiveaways()

        return
    }

    async getAllGiveaways() {
        return await this.giveawayRepository.find({
            relations: ['winner', 'item']
        })
    }

    async getUsersByGiveawayId(id) {
        return await this.giveawayUsersRepository.find({
            relations: ['user'],
            where: {
                giveaway_id: id
            }
        })
    }

    async deleteGiveaway(id) {
        await this.giveawayRepository.delete(id)

        this.giveaways = await this.getGiveaways()
    }

    async createGiveaway(giveaway) {
        await this.giveawayRepository.save(
            this.giveawayRepository.create(giveaway)
        )

        this.giveaways = await this.getGiveaways()
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async cronWinner() {
        for (const giveaway of Object.values(this.giveaways)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (new Date(giveaway.end_time) < new Date() && giveaway.winner_id === null) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (giveaway.members === 0) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    giveaway.end_time = new Date(new Date().getTime() + 5 * 60000)
                    await this.giveawayRepository.save(giveaway)

                    this.giveaways = await this.getGiveaways()

                    return
                }

                this.setWinner(giveaway)
            }
        }
    }
}

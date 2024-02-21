import {Injectable} from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {UserEntity} from "./user.entity"
import {Raw, Repository} from "typeorm"
import {RedisClientService} from "../redis-client/redis-client.service"
import TradeOfferManager from "steam-tradeoffer-manager"
import {LiveDropsService} from "../live-drops/live-drops.service"
import datef from 'datef'
import axios from "axios"
import { default as config } from 'config.json'

@Injectable()
export class UsersService {
    private manager: any

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private redisClientService: RedisClientService,
        private liveDropsService: LiveDropsService
    ) {
        this.manager = new TradeOfferManager({
            "domain": "example.com",
            "language": "en",
            "pollInterval": 5000
        })
    }

    async findOrCreate(profile) {
        let user = await this.findBySteamId(profile.steamid)

        if (!user) {
            user = await this.userRepository.create({
                username: profile.personaname,
                steamId: profile.steamid,
                avatar: profile.avatarfull,
                referral_code: Math.random().toString(36).substring(2, 15)
            })
        } else {
            user.username = profile.personaname
            user.steamId = profile.steamid
            user.avatar = profile.avatarfull

            if (user.referral_code.length === 0) {
                user.referral_code = Math.random().toString(36).substring(2, 15)
            }
        }

        user = await this.save(user)

        return user
    }

    async setTradeUrl(user: UserEntity, tradeUrl: string) {
        try {
            const data = tradeUrl.split('?')

            if (data[1]) {
                if (data[1].indexOf('partner') > -1 && data[1].indexOf('token') > -1) {
                    const offer = this.manager.createOffer(tradeUrl)

                    if (offer.partner.getSteamID64() !== user.steamId) {
                        throw 'Неверная ссылка'
                    }

                    user.trade_url = tradeUrl
                    await this.save(user)

                    return true
                }

                throw 'Неверная ссылка'
            }

            throw 'Неверная ссылка'
        } catch (e) {
            throw 'Неверная ссылка'
        }
    }

    async findBySteamId(steamId: string): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {
                steamId
            }
        })
    }

    async findById(id) {
        let user = await this.redisClientService.getData(`user_${id}`)

        if (user) {
            user.bestDrop = await this.liveDropsService.getBestDropByUserId(user.id)

            return user
        }

        user = await this.userRepository.findOne({
            where: {
                id
            }
        })

        await this.update(user)

        user.bestDrop = await this.liveDropsService.getBestDropByUserId(user.id)

        return user
    }

    async save(user: UserEntity) {
        user = await this.userRepository.save(user)
        await this.update(user)

        return user
    }

    async update(user: UserEntity) {
        await this.redisClientService.setData(`user_${user.id}`, user)
    }

    async updateReferral(user: UserEntity, ref: string) {
        if (user.referral_use !== null) {
            return
        }

        if (user.referral_code === ref) {
            return
        }

        const userRefer = await this.userRepository.findOne({
            where: {
                referral_code: ref
            }
        })

        if (!userRefer) {
            return
        }

        user.referral_use = ref
        await this.update(user)

        userRefer.referral_invited += 1
        await this.update(userRefer)

        return
    }

    async getUserByReferralCode(code: string): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {
                referral_code: code
            }
        })
    }

    async getReferralPercent(user: UserEntity) {
        if (user.referral_lvl === 1) {
            return 5
        } else if (user.referral_lvl === 2) {
            return 10
        } else if (user.referral_lvl === 3) {
            return 15
        } else if (user.referral_lvl === 4) {
            return 20
        } else if (user.referral_lvl === 5) {
            return 25
        }
    }

    async updateReferralLvl(user: UserEntity) {
        const oldLevel = user.referral_lvl
        let level = 1

        if (user.referral_sum >= 0 && user.referral_sum < 500) {
            level = 1
        } else if (user.referral_sum >= 500 && user.referral_sum < 1000) {
            level = 2
        } else if (user.referral_sum >= 1000 && user.referral_sum < 10000) {
            level = 3
        } else if (user.referral_sum >= 10000 && user.referral_sum < 30000) {
            level = 4
        } else if (user.referral_sum >= 30000) {
            level = 5
        }

        if (oldLevel !== level) {
            user.referral_lvl = level

            await this.update(user)
        }
    }

    async getRegistrationStatistic() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const d = new Date(),
            day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1),
            week = new Date(d.setDate(diff))

        week.setHours(0, 0, 0, 0)

        const date = new Date(),
            month = new Date(date.getFullYear(), date.getMonth(), 1)

        month.setHours(0, 0, 0, 0)

        return {
            daily: await this.getRegistrationStatisticByDate(today),
            weekly: await this.getRegistrationStatisticByDate(week),
            monthly: await this.getRegistrationStatisticByDate(month),
            all: await this.getRegistrationStatisticByDate(new Date(1))
        }
    }

    async getRegistrationStatisticByDate(date: Date): Promise<number> {
        const sum = await this.userRepository.createQueryBuilder()
            .select('COUNT(id)', 'cnt')
            .where(`created_at >= :date AND role <> 'bot'`, {date})
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }

    async getLastRegistrations(limit = 10): Promise<any> {
        const users = await this.userRepository.find({
            where: {
                role: Raw(alias => `${alias} <> 'bot'`)
            },
            order: {
                id: 'DESC'
            },
            take: limit
        })

        return users.map((user) => {
            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                created_at: datef('HH:mm dd.MM.YYYY', user.created_at)
            }
        })
    }

    async getUsers(data): Promise<UserEntity[]> {
        const queryBuilder = this.userRepository.createQueryBuilder()
        queryBuilder.orderBy(`${data.columnName}`, data.columnSortOrder.toUpperCase())
        queryBuilder.where(
            `role <> 'bot' AND (username LIKE '%${data.searchValue}%' OR steamId LIKE '%${data.searchValue}%' OR role LIKE '%${data.searchValue}%')`
        )
        queryBuilder.limit(data.length)
        queryBuilder.offset(data.row)

        return queryBuilder.getMany()
    }

    async getCountAllUsers() {
        const sum = await this.userRepository.createQueryBuilder()
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }

    async updateByRandomData(userId: number, data: any): Promise<UserEntity> {
        await this.userRepository.update(userId, data)

        const user = await this.userRepository.findOne(userId)

        await this.redisClientService.setData(`user_${data.id}`, user)

        return user
    }

    async getFakeUsers(data): Promise<UserEntity[]> {
        const queryBuilder = this.userRepository.createQueryBuilder()
        queryBuilder.orderBy(`${data.columnName}`, data.columnSortOrder.toUpperCase())
        queryBuilder.where(
            `role = 'bot' AND (username LIKE '%${data.searchValue}%' OR steamId LIKE '%${data.searchValue}%' OR role LIKE '%${data.searchValue}%')`
        )
        queryBuilder.limit(data.length)
        queryBuilder.offset(data.row)

        return queryBuilder.getMany()
    }

    async getCountAllFakeUsers() {
        const sum = await this.userRepository.createQueryBuilder()
            .where("role = 'bot'")
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }

    async findBots(username = '', page: number, limit: number): Promise<any> {
        const queryBuilder = this.userRepository.createQueryBuilder()
        queryBuilder.where(
            `role = 'bot' AND username LIKE '%${username}%'`
        )
        queryBuilder.limit(limit)
        queryBuilder.offset(page)

        return queryBuilder.getMany()
    }

    async createBot(steamId: string): Promise<UserEntity> {
        return axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.steam.key}&steamids=${steamId}`)
            .then(async (result) => {
                const { data } = result

                if (data.response.players.length > 0) {
                    const player = data.response.players[0]

                    return await this.userRepository.save(
                        this.userRepository.create({
                            username: player.personaname,
                            steamId: player.steamid,
                            avatar: player.avatarfull,
                            referral_code: Math.random().toString(36).substring(2, 15),
                            role: 'bot'
                        })
                    )
                } else {
                    throw 'Пользователь не найден'
                }
            })
    }

    async getRandomBot() {
        return await this.userRepository.createQueryBuilder()
            .where("role = 'bot'")
            .orderBy('RAND()')
            .limit(1)
            .getOne()
    }
}

import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {LiveDropEntity} from "./live-drop.entity"
import {MoreThanOrEqual, Raw, Repository} from "typeorm"
import {RedisClientService} from "../redis-client/redis-client.service"
import {SocketGateway} from "../socket/socket.gateway"

@Injectable()
export class LiveDropsService {
    public livedrop: any
    public openedCases: any
    public bust: any
    public upgrades: any

    constructor(
        @InjectRepository(LiveDropEntity)
        private liveDropsRepository: Repository<LiveDropEntity>,
        private redisClientService: RedisClientService,
        @Inject(CACHE_MANAGER)
        private cacheManager,
        private socketGateway: SocketGateway
    ) {
    }

    async onApplicationBootstrap() {
        this.livedrop = await this.getLiveDrop()
        this.openedCases = await this.getOpenedCases()
        this.bust = await this.getBusted()
        this.upgrades = await this.getUpgrades()
    }

    async getLiveDropAll() {
        return {
            drops: this.livedrop,
            opened: this.openedCases,
            bust: this.bust,
            upgrades: this.upgrades
        }
    }

    async updateItem(item) {
        return await this.liveDropsRepository.save(item)
    }

    async getLiveDrop(): Promise<LiveDropEntity[]> {
        return await this.liveDropsRepository.find({
            relations: ['user', 'box', 'item'],
            where: {
                invisible: 0
            },
            order: {
                id: 'DESC'
            },
            take: 10
        })
    }

    async getDropById(dropId: number) {
        return await this.liveDropsRepository.findOne({
            relations: ['item'],
            where: {
                id: dropId
            }
        })
    }

    async getTopLiveDrop(): Promise<LiveDropEntity[]> {
        return await this.liveDropsRepository.find({
            relations: ['user', 'box', 'item'],
            where: {
                price: MoreThanOrEqual(500)
            },
            order: {
                id: 'DESC'
            },
            take: 20
        })
    }

    async getOpenedCases(): Promise<number> {
        return await this.liveDropsRepository.count({
            where: {
                type: 'case'
            }
        })
    }

    async getBusted(): Promise<number> {
        return await this.liveDropsRepository.count({
            where: {
                type: 'contracts'
            }
        })
    }

    async getUpgrades(): Promise<number> {
        return await this.liveDropsRepository.count({
            where: {
                type: 'upgrade'
            }
        })
    }

    async getInventoryByUserId(userId: number): Promise<LiveDropEntity[]> {
        return await this.liveDropsRepository.find({
            relations: ['item', 'box'],
            where: {
                user_id: userId
            },
            order: {
                id: 'DESC'
            },
            take: 54
        })
    }

    async findAllByUserId(userId: number): Promise<any> {
        let liveDrops = await this.redisClientService.getData(`inventory_${userId}`)

        if (liveDrops) {
            return liveDrops
        }

        liveDrops = await this.liveDropsRepository.find({
            relations: ['item', 'box'],
            where: {
                user_id: userId
            },
            order: {
                id: 'DESC'
            }
        })

        await this.redisClientService.setData(`inventory_${userId}`, liveDrops)

        return liveDrops
    }

    async getCronDrops(now: Date) {
        return await this.liveDropsRepository.find({
            relations: ['item', 'user'],
            where: {
                created_at: Raw(alias => `${alias} <= '${now.toISOString()}'`),
                status: 0
            }
        })
    }

    async createLiveDrop(data: any): Promise<LiveDropEntity> {
        data = await this.liveDropsRepository.create(data)
        data = await this.liveDropsRepository.save(data)

        await this.redisClientService.delData(`inventory_${data.user_id}`)
        this.findAllByUserId(data.user_id)

        this.livedrop = await this.getLiveDrop()
        this.openedCases = await this.getOpenedCases()
        this.bust = await this.getBusted()
        this.upgrades = await this.getUpgrades()

        return data
    }

    async save(drop: LiveDropEntity) {
        await this.liveDropsRepository.save(drop)

        await this.redisClientService.delData(`inventory_${drop.user_id}`)
        this.findAllByUserId(drop.user_id)
    }

    async delete(drop: LiveDropEntity) {
        return await this.liveDropsRepository.delete(drop.id)
    }

    async deleteById(id: number) {
        return await this.liveDropsRepository.delete(id)
    }

    async updateLiveDrop() {
        await this.socketGateway.socket.emit('updateLivedrop', await this.getLiveDropAll())
    }

    async getOpenedByHour(userId: number, caseId: number, date) {
        const sum = await this.liveDropsRepository.createQueryBuilder()
            .select('COUNT(id)', 'sum')
            .where(`case_id = :caseId AND user_id = :userId AND created_at >= :date`, {date, userId, caseId})
            .getRawOne()

        return sum.sum === null ? 0 : sum.sum
    }

    async getBestDropByUserId(userId: number): Promise<any> {
        let drop = await this.cacheManager.get(`best_drop_${userId}`)

        if (drop) {
            return JSON.parse(drop)
        }

        drop = await this.liveDropsRepository.findOne({
            relations: ['item', 'box'],
            where: {
                user_id: userId,
                type: 'case'
            },
            order: {
                price: 'DESC'
            }
        })

        await this.cacheManager.set(`best_drop_${userId}`, JSON.stringify(drop), {ttl: 1800})

        return drop
    }

    async getOpens(data, id) {
        const queryBuilder = this.liveDropsRepository.createQueryBuilder('open')
        queryBuilder.leftJoinAndSelect("open.box", "box")
        queryBuilder.leftJoinAndSelect("open.item", "item")
        queryBuilder.orderBy(`open.${data.columnName}`, data.columnSortOrder.toUpperCase())
        queryBuilder.where(
            `(box.name LIKE '%${data.searchValue}%' OR item.market_hash_name LIKE '%${data.searchValue}%') AND open.user_id = ${id} AND open.type = 'case'`
        )
        queryBuilder.limit(data.length)
        queryBuilder.offset(data.row)

        return queryBuilder.getMany()
    }

    async getCountOpens(id) {
        const sum = await this.liveDropsRepository.createQueryBuilder()
            .where(`user_id = ${id}`)
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }
}

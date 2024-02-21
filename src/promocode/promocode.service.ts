import { Injectable } from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {PromocodeEntity} from "./promocode.entity"
import {Repository} from "typeorm"
import {PromocodeUseEntity} from "./promocode-use.entity"
import {UsersService} from "../users/users.service"
import {UserEntity} from "../users/user.entity"
import datef from 'datef'

@Injectable()
export class PromocodeService {
    constructor(
        @InjectRepository(PromocodeEntity)
        private promocodeRepository: Repository<PromocodeEntity>,
        @InjectRepository(PromocodeUseEntity)
        private promocodeUseRepository: Repository<PromocodeUseEntity>,
        private userService: UsersService
    ) {
    }

    async usePromocode(user, code) {
        const promocode = await this.promocodeRepository.findOne({
            where: {
                name: code,
                type: 'balance'
            }
        })

        if (!promocode) {
            throw 'Промокод не найден'
        }

        if (promocode.end_time !== null && promocode.end_time < new Date()) {
            throw 'Промокод закончился'
        }

        const usedPromocode = await this.getCountUsedPromoByName(promocode.id)

        if (promocode.limited !== null && Number(usedPromocode) >= promocode.limited) {
            throw 'Промокод закончился'
        }

        const userUsedPromocode = await this.promocodeUseRepository.findOne({
            where: {
                promo_id: promocode.id,
                user_id: user.id
            }
        })

        if (userUsedPromocode) {
            throw 'Вы уже активировали этот промокод'
        }

        await this.promocodeUseRepository.save(
            await this.promocodeUseRepository.create({
                user_id: user.id,
                promo_id: promocode.id
            })
        )

        user.balance += promocode.value
        await this.userService.save(user)

        return true
    }

    async checkPromocode(user: UserEntity, code: string) {
        const promocode = await this.promocodeRepository.findOne({
            where: {
                name: code,
                type: 'bonus'
            }
        })

        if (!promocode) {
            throw 'Промокод не найден'
        }

        if (promocode.end_time !== null && promocode.end_time < new Date()) {
            throw 'Промокод закончился'
        }

        const usedPromocode = await this.getCountUsedPromoByName(promocode.id)

        if (promocode.limited !== null && Number(usedPromocode) >= promocode.limited) {
            throw 'Промокод закончился'
        }

        const userUsedPromocode = await this.promocodeUseRepository.findOne({
            where: {
                promo_id: promocode.id,
                user_id: user.id
            }
        })

        if (userUsedPromocode) {
            throw 'Вы уже активировали этот промокод'
        }

        return {
            value: promocode.value,
            type: promocode.type,
            id: promocode.id
        }
    }

    async getCountUsedPromoByName(promoId: number) {
        const usedPromocode = await this.promocodeUseRepository.createQueryBuilder()
            .where(`promo_id = ${promoId}`)
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return usedPromocode.cnt === null ? 0 : usedPromocode.cnt
    }

    async getPromoById(promoId: number): Promise<PromocodeEntity> {
        return await this.promocodeRepository.findOne(promoId)
    }

    async createUsePromocode(userId: number, promoId: number) {
        await this.promocodeUseRepository.save(
            await this.promocodeUseRepository.create({
                user_id: userId,
                promo_id: promoId
            })
        )
    }

    async getPromocodes(data): Promise<any> {
        const queryBuilder = this.promocodeRepository.createQueryBuilder('')
        queryBuilder.orderBy(`${data.columnName}`, data.columnSortOrder.toUpperCase())
        queryBuilder.where(
            `name LIKE '%${data.searchValue}%'`
        )
        queryBuilder.limit(data.length)
        queryBuilder.offset(data.row)

        return queryBuilder.getMany()
    }

    async getCountAllPromocodes() {
        const sum = await this.promocodeRepository.createQueryBuilder()
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }

    async createPromocode(promocode: any) {
        let time = null

        if (promocode.end_time !== null) {
            time = new Date(datef('YYYY-MM-dd HH:mm:ss', promocode.end_time))
        }

        return await this.promocodeRepository.save(
            this.promocodeRepository.create({
                name: promocode.name,
                value: promocode.value,
                type: promocode.type,
                limited: promocode.limited,
                end_time: time
            })
        )
    }

    async deletePromocode(promocodeId: number) {
        return await this.promocodeRepository.delete(promocodeId)
    }

    async getPromocodesByUserId(userId: number) {
        return await this.promocodeUseRepository.find({
            relations: ['promo'],
            where: {
                user_id: userId
            }
        })
    }
}

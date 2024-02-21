import {forwardRef, Injectable, Inject} from '@nestjs/common'
import {Repository} from "typeorm"
import {CaseItemEntity} from "./case-item.entity"
import {InjectRepository} from "@nestjs/typeorm"
import {RedisClientService} from "../redis-client/redis-client.service"
import {CasesService} from "../cases/cases.service"

@Injectable()
export class CaseItemsService {
    constructor(
        @InjectRepository(CaseItemEntity)
        private caseItemsRepository: Repository<CaseItemEntity>,
        private redisClientService: RedisClientService,
        @Inject(forwardRef(() => CasesService))
        private casesService: CasesService
    ) {
    }

    async getItemsByCaseId(caseId: number) {
        let items = await this.redisClientService.getData(`case_${caseId}_items`)

        if (items) {
            return items
        }

        const caseItems = await this.caseItemsRepository.find({
            relations: ['item'],
            where: {
                case_id: caseId,
                visibility: 1
            }
        })

        items = []

        await Promise.all(caseItems.map(caseItem => {
            items.push(caseItem.item)
        }))

        items = items.sort((a, b) => {
            return a.price - b.price
        })

        await this.redisClientService.setData(`case_${caseId}_items`, items)

        return items
    }

    async getItemByPrice(price: number, boxId: number) {
        return await this.caseItemsRepository.createQueryBuilder('caseItem')
            .innerJoinAndSelect("caseItem.item", "item")
            .where(`case_id = ${boxId} AND item.price <= ${price} AND enabled = 1`)
            .orderBy('item.price', 'DESC')
            .getOne()
    }

    async getMinItemInCase(boxId: number) {
        return await this.caseItemsRepository.createQueryBuilder('caseItem')
            .innerJoinAndSelect("caseItem.item", "item")
            .where(`caseItem.case_id = ${boxId} AND enabled = 1`)
            .orderBy('item.price', 'ASC')
            .getOne()
    }

    async getAdminItemsByCaseId(id: number) {
        return await this.caseItemsRepository.find({
            relations: ['item'],
            where: {
                case_id: id
            }
        })
    }

    async deleteItem(id: number, caseId: number) {
        await this.redisClientService.delData(`case_${caseId}_items`)

        return await this.caseItemsRepository.delete(id)
    }

    async getItemById(id: number) {
        return await this.caseItemsRepository.findOne({
            relations: ['item'],
            where: {
                id
            }
        })
    }

    async updateItemById(body: any, caseId) {
        await this.redisClientService.delData(`case_${caseId}_items`)

        return await this.caseItemsRepository.update(body.id, body)
    }

    async createItem(body: any) {
        await this.redisClientService.delData(`case_${body.case_id}_items`)

        return await this.caseItemsRepository.save(
            this.caseItemsRepository.create(body)
        )
    }

    async transferItems(body: any) {
        const { case_id, new_case_id, transfer } = body

        const box = await this.casesService.findById(case_id)

        if (!box) {
            throw 'Кейс не найден'
        }

        if (transfer) {
            await this.caseItemsRepository.createQueryBuilder()
                .where(`case_id = ${case_id}`)
                .update({
                    case_id: new_case_id
                })
                .execute()
        } else {
            const items = await this.getItemsByCaseId(case_id)

            items.map(async (item) => {
                await this.createItem({
                    case_id: new_case_id,
                    item_id: item.id,
                    enabled: item.enabled
                })
            })
        }

        await this.redisClientService.delData(`case_${case_id}_items`)
        await this.redisClientService.delData(`case_${new_case_id}_items`)

        return true
    }
}

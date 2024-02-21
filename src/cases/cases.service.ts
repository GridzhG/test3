import {CACHE_MANAGER, HttpException, Inject, Injectable} from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {CaseEntity} from "./case.entity"
import {Repository} from "typeorm"
import {CaseItemsService} from "../case-items/case-items.service"
import {UserEntity} from "../users/user.entity"
import {UsersService} from "../users/users.service"
import {LiveDropsService} from "../live-drops/live-drops.service"
import {randomInt} from "crypto"

@Injectable()
export class CasesService {
    public cases: any

    constructor(
        @InjectRepository(CaseEntity)
        private caseRepository: Repository<CaseEntity>,
        @Inject(CACHE_MANAGER)
        private cacheManager,
        private caseItemsService: CaseItemsService,
        private usersService: UsersService,
        private liveDropsService: LiveDropsService
    ) {
    }

    async onApplicationBootstrap() {
        this.cases = await this.getCases()
    }

    async getCases(): Promise<any> {
        return await this.caseRepository.find({
            relations: ['category']
        })
    }

    async updateAllCases() {
        this.cases = await this.getCases()
    }

    async findById(id): Promise<any> {
        const caseIndex = this.cases.findIndex(x => x.id === parseInt(id))

        if (caseIndex === -1) {
            throw new HttpException('Кейс не найден', 400)
        }

        const box = this.cases[caseIndex]
        box.items = await this.caseItemsService.getItemsByCaseId(box.id)

        return box
    }

    async findByUrl(url: string): Promise<any> {
        const caseIndex = this.cases.findIndex(x => x.url === url)

        if (caseIndex === -1) {
            throw new HttpException('Кейс не найден', 400)
        }

        const box = this.cases[caseIndex]
        box.items = await this.caseItemsService.getItemsByCaseId(box.id)

        return box
    }

    async open(user: UserEntity, caseId: number, openedBoxes: number) {
        if (typeof await this.cacheManager.get(`open_case_${user.id}`) !== 'undefined') {
            throw 'Не так часто'
        }

        this.cacheManager.set(`open_case_${user.id}`, 1, {ttl: 5})

        if (openedBoxes <= 0 || openedBoxes > 10) {
            throw 'Произошла ошибка'
        }

        const box = await this.findById(caseId)

        box.bank = parseFloat(box.bank)
        box.profit = parseFloat(box.profit)

        if (!box) {
            throw 'Кейс не найден'
        }

        if (box.max_opened !== null && ((box.opened + openedBoxes) > box.max_opened)) {
            throw 'Кейс закончился'
        }

        const caseFirstBox = box.price

        let casePrices = caseFirstBox

        if (openedBoxes > 1) {
            casePrices = (box.price * (openedBoxes - 1)) + caseFirstBox
        }

        if (user.balance < casePrices) {
            throw 'Недостачно средств на балансе'
        }

        // eslint-disable-next-line prefer-const
        let {winItems, price} = await this.getWinItems(user, box, openedBoxes)

        winItems = await Promise.all(winItems.map(async (item) => {
            const drop = await this.liveDropsService.createLiveDrop({
                user_id: user.id,
                case_id: box.id,
                item_id: item.id,
                price: item.price
            })

            item.id = drop.id

            return item
        }))

        user.balance -= casePrices
        user.profit += (price - (box.price * openedBoxes))
        user.opened += openedBoxes
        await this.usersService.save(user)

        box.opened += openedBoxes
        box.profit += casePrices - price
        await this.save(box)

        this.cases = await this.getCases()

        setTimeout(async () => {
            this.liveDropsService.updateLiveDrop()
        }, 7000)

        return winItems
    }

    async save(box) {
        await this.caseRepository.save(box)

        const caseIndex = this.cases.findIndex(x => x.id === box.id)
        box[caseIndex] = box
    }

    async getWinItems(user: UserEntity, box: CaseEntity, openedBoxes: number) {
        const winItems = []
        let price = 0

        for (let i = 0; i < openedBoxes; i++) {
            let bank = box.bank
            const bank_percent = box.bank_percent

            if (box.price > bank) {
                bank = box.price
            }

            const minItem = await this.caseItemsService.getMinItemInCase(box.id)

            if (bank <= 0) {
                bank = minItem.item.price
            }

            const priceItem = randomInt(parseInt(String(minItem.item.price)), parseInt(String(bank)))
            const item = await this.caseItemsService.getItemByPrice(priceItem, box.id)

            const profit = (box.price * (bank_percent / 100)) - item.item.price

            price += item.item.price

            box.bank = box.bank + profit

            winItems.push(item.item)
        }

        return {
            winItems,
            price
        }
    }

    async getAllCases(): Promise<CaseEntity[]> {
        return await this.caseRepository.find({
            relations: ['category']
        })
    }

    async deleteCasesById(id: number) {
        await this.caseRepository.delete(id)

        this.cases = await this.getCases()
    }

    async updateCases(data: any): Promise<any> {
        if (data.old_price === '') {
            data.old_price = null
        }

        await this.caseRepository.save(data)

        this.cases = await this.getCases()
    }

    async createCases(body: any): Promise<any> {
        if (body.old_price === '') {
            body.old_price = null
        }

        await this.caseRepository.save(
            this.caseRepository.create(body)
        )

        this.cases = await this.getCases()
    }

    async fakeOpen(case_id: number, opens: number) {
        const box = await this.findById(case_id)

        if (!box) {
            throw 'Кейс не найден'
        }

        let bank = 0
        let winItems = 0
        let topItems = 0

        const percent = box.bank_percent

        for (let i = 0; i < opens; i++) {
            if (box.price > bank) {
                bank = box.price
            }

            const minItem = await this.caseItemsService.getMinItemInCase(box.id)

            if (bank <= 0) {
                bank = minItem.item.price
            }

            const priceItem = randomInt(parseInt(String(minItem.item.price)), parseInt(String(bank)))
            const item = await this.caseItemsService.getItemByPrice(priceItem, box.id)

            const profit = (box.price * (percent / 100)) - item.item.price

            bank += profit

            winItems += item.item.price

            if (item.item.price > box.price) {
                topItems += 1
            }
        }

        return {
            winItems,
            topItems
        }
    }

    async startBotGame(user) {
        const box = await this.caseRepository.createQueryBuilder()
            .orderBy('RAND()')
            .limit(1)
            .getOne()

        if (!box) {
            return
        }

        const {winItems} = await this.getWinItems(user, box, 1)

        await Promise.all(winItems.map(async (item) => {
            const drop = await this.liveDropsService.createLiveDrop({
                user_id: user.id,
                case_id: box.id,
                item_id: item.id,
                price: item.price,
                status: 1
            })

            item.id = drop.id

            return item
        }))

        user.opened += 1
        await this.usersService.save(user)

        this.cases = await this.getCases()

        this.liveDropsService.updateLiveDrop()
    }
}

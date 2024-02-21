import {CACHE_MANAGER, HttpService, Inject, Injectable, Logger} from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {Raw, Repository} from "typeorm"
import {ItemEntity} from "./item.entity"
import {MarketCsgoService} from "../market-csgo/market-csgo.service"
import {
    makeLimiterFromLimiters,
    makeLimiterWorkPerSecond,
    makeLimiterWorkPerTime,
    RateLimitQueue,
} from "../utils/limiter"
import axios from "axios"
import {Cron, CronExpression} from "@nestjs/schedule"

@Injectable()
export class ItemsService {
    public plannedUpdatePrices: boolean
    
    protected readonly itemLoaderQueue = new RateLimitQueue(makeLimiterFromLimiters([
        makeLimiterWorkPerSecond(1),
        makeLimiterWorkPerTime(5, 1000 * 60),
        makeLimiterWorkPerTime(15, 1000 * 60 * 5),
    ]))

    constructor(
        @InjectRepository(ItemEntity)
        private itemsRepository: Repository<ItemEntity>,
        private logger: Logger,
        private marketCsgoService: MarketCsgoService,
        private httpService: HttpService,
        @Inject(CACHE_MANAGER)
        private cacheManager,
    ) {
        this.logger.setContext('Предметы')

        this.plannedUpdatePrices = false
    }

    async onApplicationBootstrap() {
        this.logger.debug('Проверка наличия предметов в базе данных')

        this.checkItems()
    }

    async checkItems() {
        const itemsCount = await this.itemsRepository.count()

        if (itemsCount === 0) {
            this.logger.debug('Предметов нет в базе данных, идет обновление...')

            this.loadItems()

            return true
        }

        this.logger.debug('Предметы найдены в базе данных')

        return true
    }

    async loadItems(){
        this.logger.debug('Если запускаете проект впервые - ожидайте до 3х минут, идёт загрузка всех предметов из CS')
        axios.get(`http://csgobackpack.net/api/GetItemsList/v2/`, {
            params: {
                currency: 'RUB'
            }
        })
            .then((res) => {
                
                const result = res.data.items_list

                for (const item in result) {

                    if(result[item].tradable === 0 && result[item].marketable === 0) continue;

                    let price;

                    if(result[item].price && (<any>Object).hasOwn(result[item].price, '30_days')) {
                        price = result[item].price['30_days'].median;
                    } else {
                        price = 0;
                    }

                    const extExterior = result[item].name.split('(')
                    const extNameExterior = result[item].name.split('(')
                    let exterior = ''
                    let name = extNameExterior[0]

                    if (typeof extExterior[1] !== 'undefined') {
                        exterior = extExterior[1].split(')')[0]
                        name = name.slice(0, -1)
                    }

                    const newItem = {
                        market_hash_name: result[item].name,
                        market_name: name,
                        icon_url: result[item].icon_url ? result[item].icon_url : result[item].icon_url_large,
                        exterior: result[item].exterior,
                        rarity: result[item].rarity,
                        color: result[item].rarity_color,
                        price: price
                    }

                    this.itemsRepository.save(
                        this.itemsRepository.create(newItem)
                    )
                }
            });
    }

    // async loadItems() {
    //     try {
    //         const prices = await this.marketCsgoService.getPrices()

    //         for await (const marketItem of this.generatorSteamMarketItems()) {
    //             try {
    //                 const priceIndex = prices.findIndex(x => x.market_hash_name === marketItem.hash_name)

    //                 if (priceIndex === -1) continue

    //                 const info = marketItem.asset_description

    //                 const extExterior = info.market_hash_name.split('(')
    //                 const extNameExterior = info.market_name.split('(')
    //                 let exterior = ''
    //                 let name = extNameExterior[0]

    //                 if (typeof extExterior[1] !== 'undefined') {
    //                     exterior = extExterior[1].split(')')[0]
    //                     name = name.slice(0, -1)
    //                 }

    //                 if (!await this.checkExterior(exterior)) {
    //                     exterior = ''
    //                 }

    //                 let price

    //                 if (prices[priceIndex].volume > 10) {
    //                     price = prices[priceIndex].price
    //                 } else {
    //                     price = (marketItem.sell_price / 100) * 73.40
    //                 }

    //                 const item = {
    //                     market_hash_name: info.market_hash_name,
    //                     market_name: name,
    //                     icon_url: info.icon_url_large === '' ? info.icon_url : info.icon_url_large,
    //                     exterior: exterior,
    //                     rarity: info.type,
    //                     color: info.name_color,
    //                     price: price
    //                 }

    //                 await this.itemsRepository.save(
    //                     this.itemsRepository.create(item)
    //                 )
    //             } catch (e) {
    //                 this.logger.error(`Ошибка сохранения предмета: ${e.message}`)
    //             }
    //         }

    //         this.logger.debug('Предметы загружены')
    //     } catch (e) {
    //         this.logger.error(`Произошла ошибка при получении предметов. Причина: ${e}`)
    //     }
    // }

    async loadItemsPage(page = 0, perPage = 100) {
        perPage = Math.min(100, perPage)

        const {data} = await this.httpService.get(
            `https://steamcommunity.com/market/search/render`,
            {
                params: {
                    query: '',
                    start: page * perPage,
                    count: perPage,
                    search_descriptions: 0,
                    norender: 1,
                    sort_column: 'quantity',
                    sort_dir: 'desc',
                    appid: 730
                }
            },
        ).toPromise()

        return data
    }

    async* generatorSteamMarketItems(startPage = 0) {
        let currentPage = startPage
        const loaderBreakRule = (page) =>
            page.start >= page.total_count ||
            page.results.some(i => i.sell_listings < 0.3)

        while (true) {
            const page = await this.itemLoaderQueue.add(() => this.loadItemsPage(currentPage))

            for (const item of page.results)
                if (item.sell_listings > 0.3)
                    yield item

            if (loaderBreakRule(page)) break
            currentPage++
        }
    }

    async checkExterior(exterior: string) {
        if (exterior.toLowerCase().indexOf('factory new') > -1) {
            return true
        }

        if (exterior.toLowerCase().indexOf('minimal wear') > -1) {
            return true
        }

        if (exterior.toLowerCase().indexOf('field-tested') > -1) {
            return true
        }

        if (exterior.toLowerCase().indexOf('well-worn') > -1) {
            return true
        }

        return exterior.toLowerCase().indexOf('battle-scarred') > -1
    }

    async getAllItems(data): Promise<any> {
        const queryBuilder = this.itemsRepository.createQueryBuilder()
        queryBuilder.orderBy(`${data.columnName}`, data.columnSortOrder.toUpperCase())
        queryBuilder.where(
            `market_hash_name LIKE '%${data.searchValue}%'`
        )
        queryBuilder.limit(data.length)
        queryBuilder.offset(data.row)

        return queryBuilder.getMany()
    }

    async getCountItems(): Promise<number> {
        const sum = await this.itemsRepository.createQueryBuilder()
            .select('COUNT(id)', 'cnt')
            .getRawOne()

        return sum.cnt === null ? 0 : sum.cnt
    }

    async findById(itemId: number): Promise<ItemEntity> {
        return await this.itemsRepository.findOne(itemId)
    }

    async saveItem(item: ItemEntity): Promise<ItemEntity> {
        return await this.itemsRepository.save(item)
    }

    async createItem(name: string) {
        const request = await axios.get(`https://steamcommunity.com/market/listings/730/${name}/render?start=0&count=1&currency=1&language=english&format=json`)
        const data = request.data

        let items = Object.values(data['assets']['730'])[0]
        items = Object.values(items)

        const item = items[0]

        const exterior = ''
        const rarity = item.type

        const prices = await this.marketCsgoService.getPrices()
        const priceIndex = prices.findIndex(x => x.market_hash_name === item.market_hash_name)

        let price = 0

        if (prices[priceIndex].volume > 10) {
            price = prices[priceIndex].price
        }

        await this.itemsRepository.save(
            this.itemsRepository.create({
                market_hash_name: item.market_hash_name,
                icon_url: item.icon_url_large === '' ? item.icon_url : item.icon_url_large,
                exterior: exterior,
                rarity: rarity,
                color: item.name_color,
                price: price
            })
        )
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async updatePrices() {
        this.logger.debug('Запуск обновления цен на предметы')

        const items = await this.itemsRepository.find()
        const prices = await this.marketCsgoService.getPrices()

        for (const item of items) {
            const priceIndex = prices.findIndex(x => x.market_hash_name === item.market_hash_name)

            if (priceIndex > -1 && prices[priceIndex].volume > 10) {
                item.price = prices[priceIndex].price

                await this.itemsRepository.save(item)
            }
        }

        this.logger.debug('Обновление цен завершено')
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async planeUpdatePrices() {
        if (this.plannedUpdatePrices) {
            this.plannedUpdatePrices = false

            await this.updatePrices()
        }
    }

    async findItems(marketHashName = '', page: any, limit: number): Promise<any> {
        const queryBuilder = this.itemsRepository.createQueryBuilder()
        queryBuilder.where(
            `market_hash_name LIKE '%${marketHashName}%'`
        )
        queryBuilder.limit(limit)
        queryBuilder.offset((parseInt(page) - 1) * limit)

        return queryBuilder.getMany()
    }

    async getItemByPrice(price: number) {
        return await this.itemsRepository.createQueryBuilder('')
            .where(`price <= ${price}`)
            .orderBy('price', 'DESC')
            .getOne()
    }

    async getItems(page, sort, minPrice) {
        const value = await this.cacheManager.get(`items_${page}_${sort}_${minPrice}`)

        if (value) {
            return value
        }

        const skip = (page - 1) * 20

        const items = await this.itemsRepository.find({
            where: {
                price: Raw(alias => `${alias} >= ${minPrice}`)
            },
            order: {
                price: sort
            },
            take: 20,
            skip,
        })

        const itemsCnt = await this.itemsRepository.count({
            where: {
                price: Raw(alias => `${alias} >= ${minPrice}`)
            },
        })

        const pages = Math.ceil(itemsCnt / 20)

        const data = {
            items,
            pages
        }

        await this.cacheManager.set(`items_${page}_${sort}`, data, { ttl: 3600 })

        return data
    }

    async getRandomItemByPrice(min: number, max: number): Promise<ItemEntity> {
        return await this.itemsRepository.createQueryBuilder('')
            .where(`price >= ${min} AND price <= ${max}`)
            .orderBy('RAND()')
            .getOne()
    }
}

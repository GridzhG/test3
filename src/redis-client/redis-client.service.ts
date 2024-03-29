import { Injectable } from '@nestjs/common'
import {InjectRedis} from "@liaoliaots/nestjs-redis"
import { Redis } from 'ioredis'

@Injectable()
export class RedisClientService {
    constructor(
        @InjectRedis()
        private readonly service: Redis,
    ) {

    }

    async getData(key) {
        const data = await this.service.get(key)

        if (!data) {
            return null
        }

        return JSON.parse(data)
    }

    async setData(key, value) {
        return await this.service.set(key, JSON.stringify(value))
    }

    async delData(key) {
        return await this.service.del(key)
    }

    async lrange(key: string, start: number, stop: number) {
        return await this.service.lrange(key, start, stop)
    }

    async rpush(key: string, data: any) {
        return await this.service.rpush(key, JSON.stringify(data))
    }

    async lrem(key: string, count: number, data: any) {
        return await this.service.lrem(key, count, JSON.stringify(data))
    }
}

import {Args, Int, Mutation, Resolver} from "@nestjs/graphql"
import {Item} from "../items/model/item.model"
import {BustService} from "./bust.service"
import {CACHE_MANAGER, HttpException, Inject, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "../users/user.entity"

@Resolver(of => Item)
export class BustResolver {
    constructor(
        private bustService: BustService,
        @Inject(CACHE_MANAGER)
        private cacheManager,
    ) {
    }

    @Mutation(returns => Item)
    @UseGuards(GqlAuthGuard)
    async createBust(
        @CurrentUser() user: UserEntity,
        @Args('items', { type: () => [Int] }) items: any
    ) {
        if (typeof await this.cacheManager.get(`create_bust_${user.id}`) !== 'undefined') {
            throw 'Не так часто'
        }

        if (items.length < 3) {
            throw new HttpException('Минимум 3 предмета', 400)
        }

        if (items.length > 10) {
            throw new HttpException('Максимум 10 предметов', 400)
        }

        this.cacheManager.set(`create_bust_${user.id}`, 1, {ttl: 5})

        return await this.bustService.create(items, user)
    }
}
import {Args, Mutation, Resolver} from "@nestjs/graphql"
import {PromocodeService} from "./promocode.service"
import {CACHE_MANAGER, HttpException, Inject, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "../users/user.entity"

@Resolver()
export class PromocodeResolver {
    constructor(
        private promocodeService: PromocodeService,
        @Inject(CACHE_MANAGER)
        private cacheManager,
    ) {
    }

    @Mutation(returns => Boolean)
    @UseGuards(GqlAuthGuard)
    async usePromocode(
        @CurrentUser() user: UserEntity,
        @Args('promo', { type: () => String }) promo: string
    ) {
        if (typeof await this.cacheManager.get(`use_promocode_${user.id}`) !== 'undefined') {
            throw new HttpException('Не так часто', 400)
        }

        this.cacheManager.set(`use_promocode_${user.id}`, 1, {ttl: 5})

        try {
            await this.promocodeService.usePromocode(user, promo)

            return true
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}
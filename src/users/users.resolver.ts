import {User} from "./models/user.model"
import {Args, Context, Int, Mutation, Query, Resolver} from "@nestjs/graphql"
import {UsersService} from "./users.service"
import {CACHE_MANAGER, HttpException, Inject, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "./user.entity"
import {ReferralBalance} from "./models/referral-balance.model"
import {ConfigService} from "../config/config.service";

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private userService: UsersService,
        @Inject(CACHE_MANAGER)
        private cacheManager,
        private configService: ConfigService
    ) {
    }

    @Query(returns => User)
    async getUserById(
        @Args('id', { type: () => Int }) id: number
    ) {
        const user = await this.userService.findById(id)

        return {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            opened: user.opened,
            bestDrop: user.bestDrop
        }
    }

    @Query(returns => User)
    @UseGuards(GqlAuthGuard)
    async currentUser(@CurrentUser() user: UserEntity, @Context() context) {
        if (typeof context.req.headers.ref !== 'undefined') {
            await this.userService.updateReferral(user, context.req.headers.ref)
        }

        return this.userService.findById(user.id)
    }

    @Query(returns => ReferralBalance)
    @UseGuards(GqlAuthGuard)
    async referralBalanceToBalance(@CurrentUser() user: UserEntity) {
        if (typeof await this.cacheManager.get(`referral_balance_${user.id}`) !== 'undefined') {
            throw new HttpException('Не так часто', 400)
        }

        this.cacheManager.set(`referral_balance_${user.id}`, 1, {ttl: 5})

        if (user.referral_balance < this.configService.config.referral.to_balance) {
            throw new HttpException(`Минимальная сумма для обмена: ${this.configService.config.referral.to_balance}Р`, 400)
        }

        user.balance += user.referral_balance
        user.referral_balance = 0
        await this.userService.save(user)

        return {
            success: true
        }
    }

    @Mutation(returns => Boolean)
    @UseGuards(GqlAuthGuard)
    async setTradeLink(
        @CurrentUser() user: UserEntity,
        @Args('url', { type: () => String }) url: string
    ) {
        try {
            await this.userService.setTradeUrl(user, url)

            return true
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}
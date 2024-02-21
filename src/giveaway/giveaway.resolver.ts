import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql"
import {GiveawayService} from "./giveaway.service"
import {Giveaway} from "./models/giveaway.model"
import {HttpException, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "../users/user.entity"

@Resolver(of => Giveaway)
export class GiveawayResolver {
    constructor(
        private giveawayService: GiveawayService
    ) {
    }

    @Query(returns => [Giveaway])
    async getGiveaways() {
        return this.giveawayService.giveaways
    }

    @Mutation(returns => Boolean)
    @UseGuards(GqlAuthGuard)
    async joinGiveaway(
        @CurrentUser() user: UserEntity,
        @Args('id', { type: () => Int }) id: number
    ) {
        try {
            return await this.giveawayService.joinGiveaway(user, id)
        } catch (e) {
            console.log(e)
            throw new HttpException(e, 400)
        }
    }
}
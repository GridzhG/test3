import {Args, Int, Mutation, Resolver} from "@nestjs/graphql"
import {UpgradeService} from "./upgrade.service"
import {HttpException, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "../users/user.entity"
import {Item} from "../items/model/item.model"

@Resolver(of => Item)
export class UpgradeResolver {
    constructor(
        private upgradeService: UpgradeService
    ) {
    }

    @Mutation(returns => Item)
    @UseGuards(GqlAuthGuard)
    async upgrade(
        @CurrentUser() user: UserEntity,
        @Args('myItem', { type: () => Int }) myItem: number,
        @Args('winItem', { type: () => Int }) winItem: number
    ) {
        try {
            return await this.upgradeService.upgrade(user, myItem, winItem)
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}
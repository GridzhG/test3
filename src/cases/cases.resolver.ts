import {Resolver, Query, Args, Int, Mutation} from "@nestjs/graphql"
import {CasesService} from "./cases.service"
import {Case} from "./models/case.model"
import {HttpException, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "../users/user.entity"
import {Item} from "../items/model/item.model"

@Resolver(of => Case)
export class CasesResolver {
    constructor(
        private casesService: CasesService
    ) {
    }

    @Query(returns => [Case])
    async casesAll() {
        return this.casesService.cases
    }

    @Query(returns => Case)
    async casesGetByUrl(@Args('id', { type: () => String }) id: string) {
        return this.casesService.findByUrl(id)
    }

    @Mutation(returns => [Item])
    @UseGuards(GqlAuthGuard)
    async casesOpen(
        @CurrentUser() user: UserEntity,
        @Args('id', { type: () => Int }) id: number,
        @Args('opened', { type: () => Int }) opened: number
    ) {
        try {
            return await this.casesService.open(user, id, opened)
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}
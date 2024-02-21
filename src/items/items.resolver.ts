import {Args, Float, Int, Query, Resolver} from "@nestjs/graphql"
import {ItemsService} from "./items.service"
import {Items} from "./model/items.model"

@Resolver(of => Items)
export class ItemsResolver {
    constructor(
        private itemsService: ItemsService
    ) {
    }

    @Query(returns => Items)
    async getItems(
        @Args('page', { type: () => Int }) page: number,
        @Args('sort', { type: () => String }) sort: string,
        @Args('minPrice', { type: () => Float }) minPrice: number,
    ) {
        return await this.itemsService.getItems(page, sort, minPrice)
    }
}
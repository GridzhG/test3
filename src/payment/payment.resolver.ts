import {Args, Int, Mutation, Resolver} from "@nestjs/graphql"
import {PaymentService} from "./payment.service"
import {HttpException, UseGuards} from "@nestjs/common"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "../users/user.entity"

@Resolver()
export class PaymentResolver {
    constructor(
        private paymentService: PaymentService
    ) {
    }

    @Mutation(returns => String)
    @UseGuards(GqlAuthGuard)
    async setPayment(
        @CurrentUser() user: UserEntity,
        @Args('i', { type: () => String }) i: any,
        @Args('method', { type: () => String }) method: string,
        @Args('value', { type: () => Number }) value: number,
        @Args('promo', { type: () => String }) promo: string,
    ) {
        try {
            const response = await this.paymentService.createPayment(user, value, i, method, promo)

            return response.url
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}
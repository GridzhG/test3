import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context)

        const user = ctx.getContext().req.user

        if (user) {
           user.balance = parseFloat(user.balance)
           user.profit = parseFloat(user.profit)
        }

        return user
    },
)
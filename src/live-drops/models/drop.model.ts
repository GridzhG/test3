import { Field, Int, ObjectType } from '@nestjs/graphql'
import {Item} from "../../items/model/item.model"
import {Case} from "../../cases/models/case.model"
import {User} from "../../users/models/user.model"

@ObjectType()
export class Drop {
    @Field(type => Int)
    id: number

    @Field(type => User)
    user: User

    @Field(type => Item)
    item: Item

    @Field(type => Case, { nullable: true })
    box?: Case

    @Field({ nullable: true })
    price: number

    @Field({ nullable: true })
    status: number

    @Field({ nullable: true })
    trade_id: number

    @Field({ nullable: true })
    type: string
}
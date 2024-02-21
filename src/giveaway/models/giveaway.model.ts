import { Field, Int, ObjectType } from '@nestjs/graphql'
import {Item} from "../../items/model/item.model"

@ObjectType()
export class Giveaway {
    @Field(type => Int)
    id: number

    @Field(type => Item)
    item: Item

    @Field(type => Int)
    members: number

    @Field()
    end_time: Date
}
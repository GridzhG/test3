import { Field, Int, ObjectType } from '@nestjs/graphql'
import {Item} from "./item.model"

@ObjectType()
export class Items {
    @Field(type => [Item])
    items: Item

    @Field(type => Int)
    pages: number
}
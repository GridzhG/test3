import { Field, Int, ObjectType } from '@nestjs/graphql'
import {Category} from "../../categories/models/category.model"
import {Item} from "../../items/model/item.model"

@ObjectType()
export class Case {
    @Field(type => Int)
    id: number

    @Field({ nullable: true })
    name: string

    @Field({ nullable: true })
    url: string

    @Field({ nullable: true })
    image: string

    @Field({ nullable: true })
    old_price: number

    @Field({ nullable: true })
    price: number

    @Field({ nullable: true })
    opened: number

    @Field({ nullable: true })
    max_opened: number

    @Field(type => Category)
    category: Category

    @Field(type => [Item])
    items: Item[]
}
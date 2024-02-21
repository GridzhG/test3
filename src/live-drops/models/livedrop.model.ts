import {Field, Int, ObjectType} from "@nestjs/graphql"
import {Drop} from "./drop.model"

@ObjectType()
export class LiveDrop {
    @Field(type => [Drop])
    drops: [Drop]

    @Field(type => Int)
    opened: number

    @Field(type => Int)
    bust: number

    @Field(type => Int)
    upgrades: number
}
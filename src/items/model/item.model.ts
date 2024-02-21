import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Item {
    @Field(type => Int)
    id: number

    @Field({ nullable: true })
    market_hash_name?: string

    @Field({ nullable: true })
    market_name?: string

    @Field({ nullable: true })
    icon_url?: string

    @Field({ nullable: true })
    exterior?: string

    @Field({ nullable: true })
    rarity?: string

    @Field({ nullable: true })
    color?: string

    @Field({ nullable: true })
    price?: number
}
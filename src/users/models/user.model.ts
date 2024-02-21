import { Field, Int, ObjectType } from '@nestjs/graphql'
import {Drop} from "../../live-drops/models/drop.model"

@ObjectType()
export class User {
    @Field(type => Int)
    id: number

    @Field({ nullable: true })
    steamId?: string

    @Field({ nullable: true })
    username: string

    @Field({ nullable: true })
    avatar: string

    @Field({ nullable: true })
    balance?: number

    @Field({ nullable: true })
    opened?: number

    @Field({ nullable: true })
    contracts?: number

    @Field({ nullable: true })
    upgrades?: number

    @Field({ nullable: true })
    trade_url?: string

    @Field({ nullable: true })
    role?: string

    @Field({ nullable: true })
    is_ban_chat?: number

    @Field({ nullable: true })
    referral_code?: string

    @Field({ nullable: true })
    referral_lvl?: number

    @Field({ nullable: true })
    referral_sum?: number

    @Field({ nullable: true })
    referral_payment?: number

    @Field({ nullable: true })
    referral_balance: number

    @Field({ nullable: true })
    referral_invited: number
    
    @Field(type => Drop, { nullable: true })
    bestDrop?: Drop
}
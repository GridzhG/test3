import {Field, ObjectType} from "@nestjs/graphql"

@ObjectType()
export class ReferralBalance {
    @Field(type => Boolean)
    success: boolean
}
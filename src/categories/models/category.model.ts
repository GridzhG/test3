import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Category {
    @Field(type => Int)
    id: number

    @Field({ nullable: true })
    name: string

    @Field(type => Int, { nullable: true })
    sorting: number
}
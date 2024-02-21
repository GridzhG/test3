import {Field, ObjectType} from "@nestjs/graphql"
import {User} from "../../users/models/user.model"

@ObjectType()
export class Message {
    @Field(type => String)
    id: string

    @Field(type => User)
    user: User

    @Field(type => String)
    message: string

    @Field(type => String)
    date: string
}
import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql"
import {CACHE_MANAGER, HttpException, Inject, UseGuards} from "@nestjs/common"
import {ChatService} from "./chat.service"
import {Message} from "./models/message.model"
import {GqlAuthGuard} from "../guards/gql-auth.guard"
import {CurrentUser} from "../decorators/user.decorator"
import {UserEntity} from "../users/user.entity"
import { validURL, removeTags } from "../utils"
import {UsersService} from "../users/users.service"

@Resolver(of => Message)
export class ChatResolver {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager,
        private chatService: ChatService,
        private userService: UsersService
    ) {
    }

    @Query(returns => [Message])
    async getAllMessages() {
        return this.chatService.chat
    }

    @Mutation(returns => Boolean)
    @UseGuards(GqlAuthGuard)
    async sendMessage(
        @CurrentUser() user: UserEntity,
        @Args('message', { type: () => String }) msg: string
    ) {
        if (typeof await this.cacheManager.get(`add_message_${user.id}`) !== 'undefined') {
            throw new HttpException('Не так часто', 400)
        }

        this.cacheManager.set(`add_message_${user.id}`, 1, 3)

        if (user.is_ban_chat) {
            throw new HttpException('Вы заблокированы в чате', 400)
        }

        if (msg.length < 3) {
            throw new HttpException('Минимальное кол-во символов: 3', 400)
        }

        if (msg.length > 100) {
            throw new HttpException('Максимальное кол-во символов: 100', 400)
        }

        if (await validURL(msg)) {
            throw new HttpException('Ссылки запрещены', 400)
        }

        if ((user.role === 'admin' || user.role === 'moderator') && msg === '/clear') {
            await this.chatService.clearChat()
            this.chatService.chat = []

            return true
        }

        msg = await removeTags(msg)

        await this.chatService.addMessage(user, msg)

        return true
    }

    @Mutation(returns => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteMessage(
        @CurrentUser() user: UserEntity,
        @Args('id', { type: () => String }) id: string
    ) {
        try {
            if (!(user.role === 'admin' || user.role === 'moderator')) {
                throw 'Недостаточно прав'
            }

            await this.chatService.deleteMessage(id)

            return true
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }

    @Mutation(returns => Boolean)
    @UseGuards(GqlAuthGuard)
    async banUserInChat(
        @CurrentUser() user: UserEntity,
        @Args('id', { type: () => Int }) id: number
    ) {
        try {
            if (!(user.role === 'admin' || user.role === 'moderator')) {
                throw 'Недостаточно прав'
            }

            const userBanned = await this.userService.findById(id)

            if (!userBanned) {
                throw new HttpException('Пользователь не найден', 400)
            }

            if (userBanned.is_ban_chat) {
                throw new HttpException('Пользователь уже заблокирован в чате', 400)
            }

            userBanned.is_ban_chat = true
            await this.userService.save(userBanned)

            return true
        } catch (e) {
            throw new HttpException(e, 400)
        }
    }
}
import { Injectable } from '@nestjs/common'
import {RedisClientService} from "../redis-client/redis-client.service"
import {SocketGateway} from "../socket/socket.gateway"
import date from 'date-and-time'

@Injectable()
export class ChatService {
    public chat

    constructor(
        private redisClientService: RedisClientService,
        private socketGateway: SocketGateway
    ) {
    }

    async onApplicationBootstrap() {
        this.chat = await this.getMessages()
    }

    async getMessages() {
        const data = await this.redisClientService.lrange('chat', 0, -1)
        const messages = []
        let i = 0

        for (const chat of data.reverse()) {
            if (i === 20) break

            messages.unshift(JSON.parse(chat))
            i += 1
        }

        return messages
    }

    async addMessage(user, message) {
        const msg = {
            id: Math.random().toString(36).substring(2, 15)
                + Math.random().toString(36).substring(2, 15),
            user: {
                id: user.id,
                username: user.username,
                username_color: user.username_color,
                avatar: user.avatar,
                steamId: user.steamId,
                role: user.role,
                lvl: user.lvl
            },
            message: message,
            date: date.format(new Date(), 'HH:mm')
        }

        this.redisClientService.rpush('chat', msg)
        this.chat.push(msg)

        this.socketGateway.socket.emit('chatNewMessage', msg)

        if (this.chat.length > 20) {
            this.chat.splice(0, 1)
        }
    }

    async deleteMessage(id: string) {
        for (const message of this.chat) {
            if (message.id === id) {
                await this.redisClientService.lrem('chat', -1, message)

                const index = this.chat.findIndex(x => x.id === id)

                if (index > -1) {
                    this.chat.splice(index, 1)

                    this.socketGateway.socket.emit('chatDeleteMessage', id)
                }

                return true
            }
        }

        throw 'Сообщение не найдено'
    }

    async clearChat() {
        this.redisClientService.delData('chat')

        this.socketGateway.socket.emit('chatClear')
    }
}

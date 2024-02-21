import {CacheModule, Module} from '@nestjs/common'
import { ChatService } from './chat.service'
import {RedisClientModule} from "../redis-client/redis-client.module"
import {SocketGateway} from "../socket/socket.gateway"
import {ChatResolver} from "./chat.resolver"
import {UsersModule} from "../users/users.module"

@Module({
  imports: [CacheModule.register(), RedisClientModule, UsersModule],
  providers: [ChatService, SocketGateway, ChatResolver]
})
export class ChatModule {}

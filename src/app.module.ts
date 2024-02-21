import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from "@nestjs/typeorm"
import { RedisModule } from "@liaoliaots/nestjs-redis"
import { RedisClientModule } from './redis-client/redis-client.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ItemsModule } from './items/items.module'
import { MarketCsgoModule } from './market-csgo/market-csgo.module'
import { CategoriesModule } from './categories/categories.module'
import { CasesModule } from './cases/cases.module'
import { CaseItemsModule } from './case-items/case-items.module'
import { LiveDropsModule } from './live-drops/live-drops.module'
import { SocketModule } from './socket/socket.module'
import { SocketGateway } from './socket/socket.gateway'
import { default as config } from 'config.json'
import { ChatModule } from './chat/chat.module'
import { PromocodeModule } from './promocode/promocode.module'
import { PaymentModule } from './payment/payment.module'
import { AdminModule } from './admin/admin.module'
import { AdminCategoriesController } from './admin-categories/admin-categories.controller'
import { ConfigModule } from './config/config.module'
import { BustModule } from './bust/bust.module';
import { UpgradeModule } from './upgrade/upgrade.module';
import { GiveawayModule } from './giveaway/giveaway.module';
import { BotsModule } from './bots/bots.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RedisModule.forRoot({
      config: {
        name: 'app',
        url: 'redis://127.0.0.1:6379'
      }
    }),
    GraphQLModule.forRoot({
      cors: {
        origin: [
          config.cors.frontend_url,
          config.cors.admin_url
        ],
        credentials: true,
      },
      autoSchemaFile: 'schema.gql'
    }),
    AuthModule,
    UsersModule,
    RedisClientModule,
    ItemsModule,
    MarketCsgoModule,
    CategoriesModule,
    CasesModule,
    CaseItemsModule,
    LiveDropsModule,
    SocketModule,
    ChatModule,
    PromocodeModule,
    PaymentModule,
    AdminModule,
    ConfigModule,
    BustModule,
    UpgradeModule,
    GiveawayModule,
    BotsModule
  ],
  controllers: [AppController, AdminCategoriesController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}

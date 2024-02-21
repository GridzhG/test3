import { Module } from '@nestjs/common'
import { RedisClientService } from './redis-client.service'

@Module({
  imports: [RedisClientService],
  exports: [RedisClientService],
  providers: [RedisClientService]
})
export class RedisClientModule {}

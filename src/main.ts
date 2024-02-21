import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { default as config } from 'config.json'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')
  app.enableCors({
    origin: [
      config.cors.frontend_url,
      config.cors.admin_url
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })

  await app.listen(3000)
}
bootstrap()

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true
  })
  app.use(cookieParser())
  const configService = app.get(ConfigService)
  const port = configService.get<number>('port')
  await app.listen(port)
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('api');
  const logger = new Logger('bootstrap');
  const serverConfig = config.get('server');
  console.log(serverConfig);
  const port = process.env.PORT || serverConfig.port;
  console.log(port);
  await app.listen(port);
  logger.log(`Application listing to port = ${port}`);
}
bootstrap();

/* eslint-disable prettier/prettier */
declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1/shop/book-store');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Shopping Book Service API')
    .setDescription('API for Shoping Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/shop/book-store', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      apisSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(3002);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const logger = new Logger('bootstrap');
  logger.log('Environment : ' + process.env.NODE_ENV);
  logger.log('Status : shoping-book is runing...');
}
bootstrap();

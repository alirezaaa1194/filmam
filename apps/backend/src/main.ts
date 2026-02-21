// import 'dotenv/config';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api');

//   const config = new DocumentBuilder()
//     .setTitle('Filmam Api')
//     .setVersion('1.0')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);

//   SwaggerModule.setup('docs', app, document);
//   app.useGlobalPipes(new ValidationPipe());
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // سرو فایل‌های استاتیک Swagger
  app.useStaticAssets(
    join(__dirname, '..', 'node_modules', 'swagger-ui-dist'),
    {
      prefix: '/api/',
    },
  );

  const config = new DocumentBuilder()
    .setTitle('Filmam Api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger روی /api
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

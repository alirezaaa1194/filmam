import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Filmam Api')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customCss: `
      .swagger-ui .topbar { 
        display: none !important; 
      }
    `,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['https://filmamapp.ir'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
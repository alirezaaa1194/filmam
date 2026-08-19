import './common/enums';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Filmam Api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: `
      .swagger-ui .topbar { 
        display: none !important; 
      }
    `,
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui@5.32.11/dist/swagger-ui.min.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui@5.32.11/dist/swagger-ui-bundle.min.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui@5.32.11/dist/swagger-ui-standalone-preset.min.js',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'https://www.filmamapp.ir',
      'https://filmamapp.ir',
      'https://admin.filmamapp.ir',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:7700',
    ],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

import './common/enums';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Filmam Api')
    .setVersion('1.0')
    .addBearerAuth
    // {
    //   type: 'http',
    //   scheme: 'bearer',
    //   bearerFormat: 'JWT',
    //   name: 'JWT',
    //   description: 'Enter JWT token',
    //   in: 'header',
    // },
    // 'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    ()
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
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-standalone-preset.min.js',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // app.enableCors({
  //   origin: [
  //     'https://filmamapp.ir',
  //     'http://localhost:3000',
  //     // 'http://localhost:4000',
  //     'http://localhost:7700',
  //   ],
  //   credentials: true,
  // });

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

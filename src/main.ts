import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nestjs E-Commerical')
    .setDescription('use the base Api http://localhost:3000')
    .setTermsOfService('http://localhost:3000/term-of-service')
    .setLicense('MIT license', 'LINK')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); //http://localhost:3000/api

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

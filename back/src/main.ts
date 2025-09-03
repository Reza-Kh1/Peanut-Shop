import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './filters/prisma.filters';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV === 'development') {

    const config = new DocumentBuilder()
      .setTitle('Peanut Shop API')
      .setDescription('Peanut Shop API ')
      .setVersion('1.0')
      .addServer('http://localhost:3000', 'Local Server')
      .addServer('https://domaintest.com', 'Test Server...')
      .addBearerAuth()
      .setContact('Reza Khani', 'https://github.com/Reza-Kh1/Peanut-Shop', 'r.khani1385.66@gmail.com')
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        docExpansion: 'none',
        displayRequestDuration: true,
        filter: true,
        syntaxHighlight: {
          activated: true,
          theme: 'obsidian',
        },
      },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

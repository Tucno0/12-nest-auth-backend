import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Se habilita el cors para que se pueda hacer peticiones cross-origin, osea desde otro dominio

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen( process.env.PORT ?? 3000); // Se obtiene el puerto desde las variables de entorno o se usa el puerto 3000
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api') // jeśli używasz /api
  app.enableCors({
    origin: ['http://localhost:5173'], // Vite dev origin
    credentials: true, // jeśli cookies/autoryzacja
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

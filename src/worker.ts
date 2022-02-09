import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.WORKER_PORT);
}
bootstrap();

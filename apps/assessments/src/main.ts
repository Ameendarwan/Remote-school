import { NestFactory } from '@nestjs/core';
import { AssessmentsModule } from './assessments.module';

async function bootstrap() {
  const app = await NestFactory.create(AssessmentsModule);
  await app.listen(3000);
}
bootstrap();

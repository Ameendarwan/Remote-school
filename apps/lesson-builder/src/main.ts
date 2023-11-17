import { NestFactory } from '@nestjs/core';
import { LessonBuilderModule } from './lesson-builder.module';

async function bootstrap() {
  const app = await NestFactory.create(LessonBuilderModule);
  await app.listen(3000);
}
bootstrap();

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SchoolsModule } from './schools.module';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(SchoolsModule);
  app.setGlobalPrefix('api');

  await app.init();
  return app;
}

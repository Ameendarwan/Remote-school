import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { CurriculumBuilderModule } from './curriculum-builder.module';

async function bootstrap() {
  const app = await NestFactory.create(CurriculumBuilderModule);
  const configService = app.get(ConfigService);
  const databaseUri: string = configService.get<string>('database.host');
  // const env: string = configService.get<string>('app.env');
  // const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');

  const httpEnable: boolean = configService.get<boolean>('app.http.enable');
  app.enableCors();
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port);

  console.log(`==========================================================`);

  console.log(`Environment Variable`, 'NestApplication');
  console.log(JSON.parse(JSON.stringify(process.env)), 'NestApplication');

  console.log(`==========================================================`);

  console.log(
    `Http is ${httpEnable}, ${
      httpEnable ? 'routes registered' : 'no routes registered'
    }`,
    'NestApplication',
  );

  console.log(
    `Http Server running on ${await app.getUrl()}`,
    'NestApplication',
  );
  console.log(`Database uri ${databaseUri}`, 'NestApplication');

  console.log(`==========================================================`);
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { OrganizationModule } from './organization.module';

async function bootstrap() {
  const app = await NestFactory.create(OrganizationModule);
  const configService = app.get(ConfigService);
  const databaseUri: string = configService.get<string>('database.host');
  // const env: string = configService.get<string>('app.env');
  // const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');

  //FIXME - some how http enable is not being read from .env file weird case
  // const httpEnable: boolean = configService.get<boolean>('app.http.enable');
  const httpEnable: boolean = true;
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
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

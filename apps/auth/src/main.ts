import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';
import { HttpExceptionFilter } from './filters/http.filter';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const databaseUri: string = configService.get<string>('database.host');
  // const env: string = configService.get<string>('app.env');
  // const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');
  const tcpPort: number = configService.get<number>('app.http.tcpPort');

  const httpEnable: boolean = configService.get<boolean>('app.http.enable');

  app.enableCors();
  app.useLogger(app.get(Logger));
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: tcpPort,
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      skipNullProperties: false,
      skipUndefinedProperties: false,
      skipMissingProperties: false,
      forbidUnknownValues: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new BadRequestExceptionHandler());
  await app.startAllMicroservices();
  // await app.listen(port, host);
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

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { SchoolsModule } from './schools.module';
import swaggerInit from './swagger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(SchoolsModule);
  const configService = app.get(ConfigService);
  const databaseUri: string = configService.get<string>('database.host');
  // const env: string = configService.get<string>('app.env');
  // const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');
  // const tcpPort: number = configService.get<number>('app.tcp.port');

  useContainer(app.select(SchoolsModule), { fallbackOnErrors: true });

  // Swagger
  await swaggerInit(app);

  const httpEnable: boolean = configService.get<boolean>('app.http.enable');
  app.enableCors();
  app.useLogger(app.get(Logger));

  //NOTE - not used anywhere it as microservice yet
  //  app.connectMicroservice({
  //    transport: Transport.TCP,
  //    options: {
  //      host: '0.0.0.0',
  //      port: tcpPort,
  //    },
  //  });
  app.use(cookieParser());
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

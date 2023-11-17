import { ENUM_APP_ENVIRONMENT } from '@app/common/constants';
import { ResponseDefaultSerialization } from '@app/common/response/serializations/response.default.serialization';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default async function (app: NestApplication) {
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.env');
  const logger = new Logger();

  const docName: string = configService.get<string>('doc.name');
  const docDesc: string = configService.get<string>('doc.description');
  const docVersion: string = configService.get<string>('doc.version');
  const docPrefix: string = configService.get<string>('doc.prefix');

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .setVersion(docVersion)
      .addServer('/')
      // .addBearerAuth(
      //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      //   'accessToken',
      // )
      .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true,
      extraModels: [ResponseDefaultSerialization],
    });

    // writeFileSync(
    //   require.resolve('./data/swagger.json'),
    //   JSON.stringify(document),
    // );
    console.log('🚀 ~ file: swagger.ts:42 ~ writeFileSync:');
    SwaggerModule.setup(docPrefix, app, document, {
      jsonDocumentUrl: `${docPrefix}/json`,
      yamlDocumentUrl: `${docPrefix}/yaml`,
      explorer: true,
      customSiteTitle: docName,
      swaggerOptions: {
        docExpansion: 'none',
        persistAuthorization: true,
        displayOperationId: true,
        operationsSorter: 'method',
        tagsSorter: 'alpha',
        tryItOutEnabled: true,
        filter: true,
        deepLinking: true,
      },
    });
    console.log('🚀 ~ file: swagger.ts:42 ~ writeFileSync:');
    logger.log(`==========================================================`);

    logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');

    logger.log(`==========================================================`);
  }
}

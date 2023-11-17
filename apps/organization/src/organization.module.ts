import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import { MongooseModule } from '@nestjs/mongoose';
import configs from './configs';
import { OrganizationRepositoryModule } from './repository/organization.repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      // validationSchema: Joi.object({
      //   MONGODB_URI: Joi.string().required(),
      //   JWT_SECRET: Joi.string().required(),
      //   JWT_EXPIRATION: Joi.string().required(),
      //   HTTP_PORT: Joi.number().required(),
      //   TCP_PORT: Joi.number().required(),
      // })
    }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   validationSchema: Joi.object({
    //     MONGODB_URI: Joi.string().required(),
    //     AUTH_HOST: Joi.string().required(),
    //     PORT: Joi.number().required(),
    //     AUTH_PORT: Joi.number().required(),
    //   }),
    // }),

    // ClientsModule.registerAsync([
    //   {
    //     name: AUTH_SERVICE,
    //     useFactory: (configService: ConfigService) => ({
    //       transport: Transport.TCP,
    //       options: {
    //         host: configService.get('AUTH_HOST'),
    //         port: configService.get('AUTH_PORT'),
    //       },
    //     }),
    //     inject: [ConfigService],
    //   },
    // ]),
    MongooseModule.forRootAsync({
      // connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionsModule],
      inject: [DatabaseOptionsService],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    LoggerModule,
    OrganizationRepositoryModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}

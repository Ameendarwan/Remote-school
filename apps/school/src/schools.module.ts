import { LoggerModule } from '@app/common/logger';
import { Module } from '@nestjs/common';
import { ClassSubjectsModule } from './class-subjects/class-subjects.module';
import { ClassesModule } from './classes/classes.module';
import { GradesModule } from './grades/grades.module';
import { SchoolService } from './school.service';
import { SchoolsController } from './schools.controller';
import { SubjectModule } from './subject/subject.module';

import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import { AddressModule } from '@app/common/modules/address/address.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configs from './configs';
import { OrganizationModule } from './organization/organization.module';
import { SchoolRepositoryModule } from './repository/school.repository.module';

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

    MongooseModule.forRootAsync({
      imports: [DatabaseOptionsModule],
      inject: [DatabaseOptionsService],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    OrganizationModule,
    AddressModule,
    SchoolRepositoryModule,
    ClassesModule,
    GradesModule,
    SubjectModule,
    ClassSubjectsModule,
    LoggerModule,
  ],
  controllers: [SchoolsController],
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolsModule {}

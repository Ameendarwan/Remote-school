import { Module } from '@nestjs/common';
import { SchoolsModule } from 'apps/school/src/schools.module';
import { CommandModule } from 'nestjs-command';

import { ConfigModule } from '@nestjs/config';
import configs from 'apps/school/src/configs';
import { MigrationRealSchoolSeed } from './seeds/real/migration.school.real.seed';
import { OrganizationModule } from 'apps/organization/src/organization.module';

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
    CommandModule,
    // AuthModule,
    OrganizationModule,
    SchoolsModule,
    // UsersModule,
    // AddressModule,
    // TeacherModule,
    // StudentModule,
  ],
  providers: [
    MigrationRealSchoolSeed,
    // MigrationAddressSeed,
    // MigrationSchoolSeed,
    // MigrationOrganizationSeed,
    // MigrationTeacherSeed,
    // MigrationUserSeed,
    // MigrationStudentSeed,
  ],
  exports: [],
})
export class MigrationModule {}

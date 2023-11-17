import { Module } from '@nestjs/common';
import { CurriculumBuilderService } from './curriculum-builder.service';
import { CurriculumBuilderController } from './curriculum-builder.controller';
import { ChaptersModule } from './chapters/chapters.module';
import { LessonsModule } from './lessons/lessons.module';
import { CurriculumBuilderRepositoryModule } from './repository/curriculum-builder.repository.module';
import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configs from './configs';
import { LoggerModule } from '@app/common';

@Module({
  controllers: [CurriculumBuilderController],
  providers: [CurriculumBuilderService],
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
      // connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionsModule],
      inject: [DatabaseOptionsService],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    LoggerModule,
    CurriculumBuilderRepositoryModule,
    ChaptersModule,
    LessonsModule,
  ],
})
export class CurriculumBuilderModule {}

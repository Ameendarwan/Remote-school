import { DATABASE_CONNECTION_NAME } from '@app/common/database/constants/database.constant';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuestionLogEntity,
  QuestionLogSchema,
} from './entities/question-log.entity';
import { QuestionLogRepository } from './repositories/question-log.repository';

@Module({
  providers: [QuestionLogRepository],
  exports: [QuestionLogRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: QuestionLogEntity.name,
          schema: QuestionLogSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class QuestionLogRepositoryModule {}

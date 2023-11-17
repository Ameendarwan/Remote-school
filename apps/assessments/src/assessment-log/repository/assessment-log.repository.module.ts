import { DATABASE_CONNECTION_NAME } from '@app/common/database/constants/database.constant';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AssessmentLogEntity,
  AssessmentLogSchema,
} from './entities/assessment-log.entity';
import { AssessmentLogRepository } from './repositories/assessment-log.repository';

@Module({
  providers: [AssessmentLogRepository],
  exports: [AssessmentLogRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: AssessmentLogEntity.name,
          schema: AssessmentLogSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class AssessmentLogRepositoryModule {}

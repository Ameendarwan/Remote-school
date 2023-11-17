import { DATABASE_CONNECTION_NAME } from '@app/common/database/constants/database.constant';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AssessmentsEntity,
  AssessmentsSchema,
} from './entities/assessment.entity';
import { AssessmentsRepository } from './repositories/assessment.repository';

@Module({
  providers: [AssessmentsRepository],
  exports: [AssessmentsRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: AssessmentsEntity.name,
          schema: AssessmentsSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class AssessmentsRepositoryModule {}

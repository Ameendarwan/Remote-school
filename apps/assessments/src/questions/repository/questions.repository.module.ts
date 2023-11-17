import { DATABASE_CONNECTION_NAME } from '@app/common/database/constants/database.constant';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsEntity, QuestionsSchema } from './entities/question.entity';
import { QuestionsRepository } from './repositories/questions.repository';

@Module({
  providers: [QuestionsRepository],
  exports: [QuestionsRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: QuestionsEntity.name,
          schema: QuestionsSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class QuestionsRepositoryModule {}

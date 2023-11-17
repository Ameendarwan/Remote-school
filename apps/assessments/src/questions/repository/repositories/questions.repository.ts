import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import {
  DatabaseConnection,
  DatabaseModel,
} from '@app/common/database/decorators/database.decorator';
import { QuestionsEntity, QuestionsDoc } from '../entities/question.entity';

@Injectable()
export class QuestionsRepository extends DatabaseMongoUUIDRepositoryAbstract<
  QuestionsEntity,
  QuestionsDoc
> {
  constructor(
    @DatabaseConnection() private connection: Connection,
    @DatabaseModel(QuestionsEntity.name)
    private readonly QuestionsDoc: Model<QuestionsEntity>,
  ) {
    super(QuestionsDoc);
  }
}

import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import {
  DatabaseConnection,
  DatabaseModel,
} from '@app/common/database/decorators/database.decorator';
import { Injectable } from '@nestjs/common/decorators';
import { Connection, Model } from 'mongoose';
import {
  QuestionLogDoc,
  QuestionLogEntity,
} from '../entities/question-log.entity';

@Injectable()
export class QuestionLogRepository extends DatabaseMongoUUIDRepositoryAbstract<
  QuestionLogEntity,
  QuestionLogDoc
> {
  constructor(
    @DatabaseConnection() private connection: Connection,
    @DatabaseModel(QuestionLogEntity.name)
    private readonly QuestionLogDoc: Model<QuestionLogEntity>,
  ) {
    super(QuestionLogDoc);
  }
}

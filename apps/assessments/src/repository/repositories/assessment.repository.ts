import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import {
  DatabaseConnection,
  DatabaseModel,
} from '@app/common/database/decorators/database.decorator';
import { Injectable } from '@nestjs/common/decorators';
import { Connection, Model } from 'mongoose';
import {
  AssessmentsDoc,
  AssessmentsEntity,
} from '../entities/assessment.entity';

@Injectable()
export class AssessmentsRepository extends DatabaseMongoUUIDRepositoryAbstract<
  AssessmentsEntity,
  AssessmentsDoc
> {
  constructor(
    @DatabaseConnection() private connection: Connection,
    @DatabaseModel(AssessmentsEntity.name)
    private readonly AssessmentsDoc: Model<AssessmentsEntity>,
  ) {
    super(AssessmentsDoc);
  }
}

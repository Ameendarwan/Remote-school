import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import {
  DatabaseConnection,
  DatabaseModel,
} from '@app/common/database/decorators/database.decorator';
import {
  AssessmentLogEntity,
  AssessmentLogDoc,
} from '../entities/assessment-log.entity';

@Injectable()
export class AssessmentLogRepository extends DatabaseMongoUUIDRepositoryAbstract<
  AssessmentLogEntity,
  AssessmentLogDoc
> {
  constructor(
    @DatabaseConnection() private connection: Connection,
    @DatabaseModel(AssessmentLogEntity.name)
    private readonly AssessmentLogDoc: Model<AssessmentLogEntity>,
  ) {
    super(AssessmentLogDoc);
  }
}

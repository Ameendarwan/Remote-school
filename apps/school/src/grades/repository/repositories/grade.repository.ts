import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { GradeEntity, GradeDoc } from '../entities/grade.entity';

@Injectable()
export class GradeRepository extends DatabaseMongoUUIDRepositoryAbstract<
  GradeEntity,
  GradeDoc
> {
  constructor(
    @DatabaseModel(GradeEntity.name)
    private readonly GradeDoc: Model<GradeEntity>,
  ) {
    super(GradeDoc);
  }
}

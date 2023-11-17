import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { SubjectEntity, SubjectDoc } from '../entities/subject.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubjectRepository extends DatabaseMongoUUIDRepositoryAbstract<
  SubjectEntity,
  SubjectDoc
> {
  constructor(
    @DatabaseModel(SubjectEntity.name)
    SubjectDoc: Model<SubjectEntity>,
  ) {
    super(SubjectDoc);
  }
}

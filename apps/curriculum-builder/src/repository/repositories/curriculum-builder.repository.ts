import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import {
  CurriculumBuilderDoc,
  CurriculumBuilderEntity,
} from '../entities/curriculum-builder.entity';

@Injectable()
export class CurriculumBuilderRepository extends DatabaseMongoUUIDRepositoryAbstract<
  CurriculumBuilderEntity,
  CurriculumBuilderDoc
> {
  constructor(
    @DatabaseModel(CurriculumBuilderEntity.name)
    private readonly curriculumModel: Model<CurriculumBuilderEntity>,
  ) {
    super(curriculumModel);
  }
}

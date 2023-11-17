import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { LessonEntity, LessonDoc } from '../entities/lesson.entity';

@Injectable()
export class LessonsRepository extends DatabaseMongoUUIDRepositoryAbstract<
  LessonEntity,
  LessonDoc
> {
  constructor(
    @DatabaseModel(LessonEntity.name)
    private readonly LessonsDoc: Model<LessonEntity>,
  ) {
    super(LessonsDoc);
  }
}

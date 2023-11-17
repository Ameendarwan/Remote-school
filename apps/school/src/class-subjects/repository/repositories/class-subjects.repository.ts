import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { Injectable } from '@nestjs/common/decorators';
import { Model } from 'mongoose';
import {
  ClassSubjectsDoc,
  ClassSubjectsEntity,
} from '../entities/class-subject.entity';

@Injectable()
export class ClassSubjectsRepository extends DatabaseMongoUUIDRepositoryAbstract<
  ClassSubjectsEntity,
  ClassSubjectsDoc
> {
  constructor(
    @DatabaseModel(ClassSubjectsEntity.name)
    private readonly ClassSubjectsDoc: Model<ClassSubjectsEntity>,
  ) {
    super(ClassSubjectsDoc);
  }
}

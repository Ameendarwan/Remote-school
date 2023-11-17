import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { ClassesEntity, ClassesDoc } from '../entities/class.entity';

@Injectable()
export class ClassesRepository extends DatabaseMongoUUIDRepositoryAbstract<
  ClassesEntity,
  ClassesDoc
> {
  constructor(
    @DatabaseModel(ClassesEntity.name)
    private readonly ClassesDoc: Model<ClassesEntity>,
  ) {
    super(ClassesDoc);
  }
}

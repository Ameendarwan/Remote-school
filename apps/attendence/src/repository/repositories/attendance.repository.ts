import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { Model } from 'mongoose';
import { AttendenceDoc, AttendenceEntity } from '../entities/attendence.entity';

@Injectable()
export class AttendenceRepository extends DatabaseMongoUUIDRepositoryAbstract<
  AttendenceEntity,
  AttendenceDoc
> {
  constructor(
    @DatabaseModel(AttendenceEntity.name)
    AttendenceDoc: Model<AttendenceEntity>,
  ) {
    super(AttendenceDoc);
  }
}

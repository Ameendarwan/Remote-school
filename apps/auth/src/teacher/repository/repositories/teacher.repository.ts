import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { UserEntity } from '@app/common/entities/auth/user.entity';
import { Injectable } from '@nestjs/common/decorators';
import { Model } from 'mongoose';
import { TeacherDoc, TeacherEntity } from '../entities/teacher.entity';

@Injectable()
export class TeacherRepository extends DatabaseMongoUUIDRepositoryAbstract<
  TeacherEntity,
  TeacherDoc
> {
  constructor(
    @DatabaseModel(TeacherEntity.name)
    private readonly TeacherDoc: Model<TeacherEntity>,
  ) {
    super(TeacherDoc, [
      {
        path: 'userId',
        localField: 'userId',
        foreignField: '_id',
        model: UserEntity.name,
      },
    ]);
  }
}

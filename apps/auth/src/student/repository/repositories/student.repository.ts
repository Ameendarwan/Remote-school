import { Injectable } from '@nestjs/common/decorators';
import { StudentDoc, StudentEntity } from '../entities/student.entity';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { Model } from 'mongoose';
import { UserEntity } from '@app/common/entities/auth/user.entity';

@Injectable()
export class StudentRepository extends DatabaseMongoUUIDRepositoryAbstract<
  StudentEntity,
  StudentDoc
> {
  constructor(
    @DatabaseModel(StudentEntity.name)
    private readonly StudentDoc: Model<StudentEntity>,
  ) {
    super(StudentDoc, {
      path: 'userId',
      localField: 'userId',
      foreignField: '_id',
      model: UserEntity.name,
    });
  }
}

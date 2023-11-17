import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import {
  UserDoc,
  UserEntity,
} from '../../../../../../libs/common/src/entities/auth/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends DatabaseMongoUUIDRepositoryAbstract<
  UserEntity,
  UserDoc
> {
  constructor(
    @DatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {
    super(userModel);
  }
}

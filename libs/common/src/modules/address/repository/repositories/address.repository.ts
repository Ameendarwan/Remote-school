import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';

import {
  AddressDoc,
  AddressEntity,
} from '../../../../entities/auth/address.entity';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';

@Injectable()
export class AddressRepository extends DatabaseMongoUUIDRepositoryAbstract<
  AddressEntity,
  AddressDoc
> {
  constructor(
    @DatabaseModel(AddressEntity.name)
    private readonly AddressDoc: Model<AddressEntity>,
  ) {
    super(AddressDoc);
  }
}

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common/decorators';
import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { SchoolEntity, SchoolDoc } from '../entities/school.entity';
import { AddressEntity } from '@app/common/entities/auth';
import { OrganizationEntity } from 'apps/organization/src/repository/entities/organization.entity';

@Injectable()
export class SchoolRepository extends DatabaseMongoUUIDRepositoryAbstract<
  SchoolEntity,
  SchoolDoc
> {
  constructor(
    @DatabaseModel(SchoolEntity.name)
    private readonly SchoolDoc: Model<SchoolEntity>,
  ) {
    super(SchoolDoc, [
      {
        path: 'organizationId',
        localField: 'organizationId',
        foreignField: '_id',
        model: OrganizationEntity.name,
      },
      {
        path: 'addressId',
        localField: 'addressId',
        foreignField: '_id',
        model: AddressEntity.name,
      },
    ]);
  }
}

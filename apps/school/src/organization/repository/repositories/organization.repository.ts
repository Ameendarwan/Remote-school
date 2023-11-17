import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { Injectable } from '@nestjs/common/decorators';
import { Model } from 'mongoose';
import {
  OrganizationDoc,
  OrganizationEntity,
} from '../entities/organization.entity';

@Injectable()
export class OrganizationRepository extends DatabaseMongoUUIDRepositoryAbstract<
  OrganizationEntity,
  OrganizationDoc
> {
  constructor(
    @DatabaseModel(OrganizationEntity.name)
    private readonly OrganizationDoc: Model<OrganizationEntity>,
  ) {
    super(OrganizationDoc);
  }
}

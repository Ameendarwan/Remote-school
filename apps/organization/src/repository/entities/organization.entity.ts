import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const OrganizationDatabaseName = 'organization';

@DatabaseEntity({ collection: OrganizationDatabaseName })
export class OrganizationEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const OrganizationSchema =
  SchemaFactory.createForClass(OrganizationEntity);

export type OrganizationDoc = OrganizationEntity & Document<string>;

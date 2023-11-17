import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { AddressEntity } from '@app/common/entities/auth/address.entity';
import { OrganizationEntity } from 'apps/organization/src/repository/entities/organization.entity';
import { Document, Types } from 'mongoose';

export const schoolDatabaseName = 'school';

@DatabaseEntity({ collection: schoolDatabaseName })
export class SchoolEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Number })
  offline: number;

  @Prop({ type: String })
  model: string;

  @Prop({ type: Date })
  started: Date;

  @Prop({ type: String })
  electricity: string;

  @Prop({ type: String })
  internet: string;

  @Prop({ type: String })
  schoolType: string;

  @Prop({ type: Number })
  estimatedHousehold: number;

  @Prop({ type: String })
  spaceType: string;

  @Prop({ type: String })
  nearestSchool: string;

  @Prop({
    required: true,
    ref: OrganizationEntity.name,
    index: true,
    type: Types.ObjectId,
  })
  organizationId: string;

  @Prop({ type: String, ref: AddressEntity.name, required: true })
  addressId: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const SchoolSchema = SchemaFactory.createForClass(SchoolEntity);

SchoolSchema.virtual('address', {
  ref: AddressEntity.name,
  localField: 'addressId',
  foreignField: '_id',
});

SchoolSchema.virtual('organization', {
  ref: OrganizationEntity.name,
  localField: 'organizationId',
  foreignField: '_id',
});

export type SchoolDoc = SchoolEntity & Document<string>;

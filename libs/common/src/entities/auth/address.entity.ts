import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const AddressDatabaseName = 'address';

@DatabaseEntity({ collection: AddressDatabaseName })
export class AddressEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String })
  street: string;

  @Prop({ type: String })
  street1: string;

  @Prop({ type: String })
  council: string;

  @Prop({ type: String })
  town: string;

  @Prop({ type: String })
  tehsil: string;

  @Prop({ type: String })
  district: string;

  @Prop({ type: String })
  county: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: Number, float: true, index: true })
  latitude: number;

  @Prop({ type: Number, float: true, index: true })
  longitude: number;

  @Prop({ type: Object, default: {} })
  addressDetails: Record<string, any>;
}

export const AddressSchema = SchemaFactory.createForClass(AddressEntity);
export type AddressDoc = AddressEntity & Document<string>;

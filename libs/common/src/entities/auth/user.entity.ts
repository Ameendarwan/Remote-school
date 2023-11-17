import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../../../../../apps/auth/src/users/dto/create-user.dto';
import { AddressEntity } from '@app/common/entities/auth/address.entity';

export const UserDatabaseName = 'user';

@DatabaseEntity({ collection: UserDatabaseName })
export class UserEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: false,
    // sparse: true,
    trim: true,
    type: String,
    // unique: true,
    maxlength: 100,
  })
  username?: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({ enum: UserRole, required: true })
  role: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    type: String,
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    type: String,
    maxlength: 50,
  })
  lastName: string;

  @Prop({
    lowercase: true,
    trim: true,
    type: String,
    maxlength: 50,
  })
  middleName?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  gender?: string;

  @Prop({ type: Types.ObjectId, ref: AddressEntity.name, required: true })
  addressId: string;

  @Prop()
  imageUrl?: string;

  @Prop({
    required: false,
    // index: true,
    // unique: true,
    trim: true,
    lowercase: true,
    type: String,
    maxlength: 100,
  })
  email?: string;

  @Prop({
    required: false,
    trim: true,
    // unique: true,
    type: String,
    // maxlength: 15,
  })
  primaryPhone?: string;

  @Prop({
    required: false,
    trim: true,
    // unique: true,
    type: String,
    // maxlength: 15,
  })
  secondaryPhone?: string;

  @Prop({ default: false })
  isDisabled: boolean;

  @Prop({ default: false })
  locked: boolean;

  @Prop({ type: Object })
  userDetails?: Record<string, any>;

  @Prop({
    required: false,
    default: true,
    type: Boolean,
  })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
export type UserDoc = UserEntity & Document<string>;
UserSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

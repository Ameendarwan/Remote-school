import {
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
  DATABASE_EFFECTIVE_AT_FIELD_NAME,
  DATABASE_UPDATED_BY_FIELD_NAME,
  DATABASE_SMASHED_AT_FIELD_NAME,
} from '@app/common/database/constants/database.constant';
import { DatabaseDefaultUUID } from '@app/common/database/constants/database.function.constant';
import { Prop } from '@nestjs/mongoose';
import { DatabaseBaseEntityAbstract } from '../../database.base-entity.abstract';

const USER_ENTITY_NAME = 'user';

export abstract class DatabaseMongoUUIDEntityAbstract extends DatabaseBaseEntityAbstract<string> {
  @Prop({
    type: String,
    default: DatabaseDefaultUUID,
  })
  _id: string;

  @Prop({ type: Date, default: Date.now })
  [DATABASE_EFFECTIVE_AT_FIELD_NAME]?: Date;

  // @Prop({ type: String, ref: UserEntity.name, required: true })
  //FIXME - can't add user-entity here seems like user entity is also extending from this class then becoming dependency on it circular dependency caught
  @Prop({ type: String, ref: USER_ENTITY_NAME, required: false })
  [DATABASE_UPDATED_BY_FIELD_NAME]?: string;

  @Prop({
    required: false,
    index: true,
    type: Date,
  })
  [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: true,
    type: Date,
  })
  [DATABASE_SMASHED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: 'asc',
    type: Date,
  })
  [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: 'desc',
    type: Date,
  })
  [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}

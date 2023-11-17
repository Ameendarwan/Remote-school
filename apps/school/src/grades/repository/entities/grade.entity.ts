import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { OrganizationEntity } from 'apps/organization/src/repository/entities/organization.entity';
import { Document, Types } from 'mongoose';

export const gradeDatabaseName = 'grades';

@DatabaseEntity({ collection: gradeDatabaseName })
export class GradeEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    ref: OrganizationEntity.name,
    index: true,
    type: Types.ObjectId,
  })
  organizationId: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const GradeSchema = SchemaFactory.createForClass(GradeEntity);

export type GradeDoc = GradeEntity & Document<string>;

import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const assessmentDatabaseName = 'assessment';

@DatabaseEntity({ collection: assessmentDatabaseName })
export class AssessmentsEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  instructions: string;

  @Prop({ type: String, ref: 'Subject' })
  subjectId: string;

  @Prop({ type: Object })
  details: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  effectiveAt: Date;

  @Prop({ type: String, ref: 'User', required: true })
  updatedBy: string;
}

export type AssessmentsDoc = AssessmentsEntity & Document;

export const AssessmentsSchema =
  SchemaFactory.createForClass(AssessmentsEntity);

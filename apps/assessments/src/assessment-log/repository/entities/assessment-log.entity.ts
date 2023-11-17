import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const assessmentLogDatabaseName = 'assessment-log';

@DatabaseEntity({ collection: assessmentLogDatabaseName })
export class AssessmentLogEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, ref: 'Student' })
  studentId: string;

  @Prop({ type: String, ref: 'Assessment' })
  assessmentId: string;

  @Prop({ type: Date })
  startedAt: Date;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: Number })
  score: number;

  @Prop({ type: String })
  grade: string;

  @Prop({ type: String })
  comments: string;

  @Prop({ type: String, ref: 'User' })
  commentedBy: string;

  @Prop({ type: Object })
  details: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  effectiveAt: Date;

  @Prop({ type: String, ref: 'User' })
  updatedBy: string;
}

export type AssessmentLogDoc = AssessmentLogEntity & Document;

export const AssessmentLogSchema =
  SchemaFactory.createForClass(AssessmentLogEntity);

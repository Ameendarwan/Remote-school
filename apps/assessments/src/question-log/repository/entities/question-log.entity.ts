import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const questionLogDatabaseName = 'question-log';

@DatabaseEntity({ collection: questionLogDatabaseName })
export class QuestionLogEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, ref: 'Student' })
  studentId: string;

  @Prop({ type: String, ref: 'Question' })
  questionId: string;

  @Prop({ type: Date })
  startedAt: Date;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: String })
  response: string;

  @Prop({ type: Number })
  score: number;

  @Prop({ type: String })
  grade: string;

  @Prop({ type: String, ref: 'User' })
  updatedBy: string;

  @Prop({ type: Object })
  details: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  effectiveAt: Date;
}

export type QuestionLogDoc = QuestionLogEntity & Document;

export const QuestionLogSchema =
  SchemaFactory.createForClass(QuestionLogEntity);

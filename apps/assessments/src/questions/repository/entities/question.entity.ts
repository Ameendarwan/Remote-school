import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const questionsDatabaseName = 'questions';

@DatabaseEntity({ collection: questionsDatabaseName })
export class QuestionsEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  instructions: string;

  @Prop({ type: Number })
  score: number;

  @Prop({ type: Object, default: {} })
  responses: Record<string, any>;

  @Prop({ type: String, ref: 'Assessment' })
  assessmentId: string;

  @Prop({ type: Object })
  details: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  effectiveAt: Date;

  @Prop({ type: String, ref: 'User' })
  updatedBy: string;
}

export type QuestionsDoc = QuestionsEntity & Document;

export const QuestionsSchema = SchemaFactory.createForClass(QuestionsEntity);

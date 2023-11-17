import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { AssessmentsEntity } from 'apps/assessments/src/repository/entities/assessment.entity';
import { ChaptersEntity } from 'apps/curriculum-builder/src/chapters/repository/entities/chapter.entity';
import { Document } from 'mongoose';

export const lessonsDatabaseName = 'lessons';

@DatabaseEntity({ collection: lessonsDatabaseName })
export class LessonEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  instructions: string;

  @Prop({ type: String, ref: ChaptersEntity.name })
  chapterId: string;

  @Prop({ type: String })
  media: string;

  @Prop({ type: String, ref: AssessmentsEntity.name })
  assessmentId: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const LessonSchema = SchemaFactory.createForClass(LessonEntity);

export type LessonDoc = LessonEntity & Document<string>;

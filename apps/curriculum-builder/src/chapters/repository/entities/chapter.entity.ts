import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { AssessmentsEntity } from 'apps/assessments/src/repository/entities/assessment.entity';
import { CurriculumBuilderEntity } from 'apps/curriculum-builder/src/repository/entities/curriculum-builder.entity';
import { SubjectEntity } from 'apps/school/src/subject/repository/entities/subject.entity';
import { Document } from 'mongoose';

export const chaptersDatabaseName = 'chapters';

@DatabaseEntity({ collection: chaptersDatabaseName })
export class ChaptersEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  order: number;

  @Prop({ type: String })
  lessonType: string;

  @Prop({ type: String, ref: SubjectEntity.name })
  subjectId: string;

  @Prop({ type: String, ref: CurriculumBuilderEntity.name })
  curriculumId: string;

  @Prop({ type: String, ref: AssessmentsEntity.name })
  assessmentId: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const ChaptersSchema = SchemaFactory.createForClass(ChaptersEntity);

export type ChaptersDoc = ChaptersEntity & Document<string>;

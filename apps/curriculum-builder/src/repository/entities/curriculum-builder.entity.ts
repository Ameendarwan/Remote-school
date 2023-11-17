import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { SubjectEntity } from 'apps/school/src/subject/repository/entities/subject.entity';
import { Document, Types } from 'mongoose';

export const curriculumDatabaseName = 'curriculum';

@DatabaseEntity({ collection: curriculumDatabaseName })
export class CurriculumBuilderEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    required: true,
    ref: SubjectEntity.name,
    index: true,
    type: Types.ObjectId,
  })
  subjectId: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const CurriculumBuilderSchema = SchemaFactory.createForClass(
  CurriculumBuilderEntity,
);

export type CurriculumBuilderDoc = CurriculumBuilderEntity & Document<string>;

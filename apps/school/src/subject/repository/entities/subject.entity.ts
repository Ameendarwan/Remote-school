import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { GradeEntity } from 'apps/school/src/grades/repository/entities/grade.entity';
import { Document, Types } from 'mongoose';

export const subjectDatabaseName = 'subjects';

@DatabaseEntity({ collection: subjectDatabaseName })
export class SubjectEntity extends DatabaseMongoUUIDEntityAbstract {
  // @Prop({
  //   required: true,
  //   ref: CurriculumBuilderEntity.name,
  //   index: true,
  //   type: Types.ObjectId,
  // })
  // curriculum: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Types.ObjectId, ref: GradeEntity.name, required: true })
  gradeId: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const SubjectSchema = SchemaFactory.createForClass(SubjectEntity);

export type SubjectDoc = SubjectEntity & Document<string>;

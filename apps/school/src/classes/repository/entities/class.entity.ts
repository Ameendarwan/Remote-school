import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { TeacherEntity } from 'apps/auth/src/teacher/repository/entities/teacher.entity';
import { GradeEntity } from 'apps/school/src/grades/repository/entities/grade.entity';
import { SchoolEntity } from 'apps/school/src/repository/entities/school.entity';
import { Document, Types } from 'mongoose';

export const classesDatabaseName = 'classes';

@DatabaseEntity({ collection: classesDatabaseName })
export class ClassesEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    ref: SchoolEntity.name,
    type: Types.ObjectId,
  })
  schoolId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    required: true,
    ref: GradeEntity.name,
    type: Types.ObjectId,
  })
  gradeId: string;

  @Prop({
    required: true,
    ref: TeacherEntity.name,
    type: Types.ObjectId,
  })
  classTeacherId: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const ClassesSchema = SchemaFactory.createForClass(ClassesEntity);

export type ClassesDoc = ClassesEntity & Document<string>;

import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { StudentEntity } from 'apps/auth/src/student/repository/entities/student.entity';
import { TeacherEntity } from 'apps/auth/src/teacher/repository/entities/teacher.entity';
import { ClassesEntity } from 'apps/school/src/classes/repository/entities/class.entity';
import { SubjectEntity } from 'apps/school/src/subject/repository/entities/subject.entity';
import { Document, Types } from 'mongoose';

export const classSubjectsDatabaseName = 'class_subjects';

@DatabaseEntity({ collection: classSubjectsDatabaseName })
export class ClassSubjectsEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    ref: ClassesEntity.name,
    index: true,
    type: Types.ObjectId,
  })
  classId: string;

  @Prop({
    required: true,
    ref: SubjectEntity.name,
    index: true,
    type: Types.ObjectId,
  })
  subjectId: string;

  @Prop({
    required: true,
    ref: TeacherEntity.name,
    index: true,
    type: Types.ObjectId,
  })
  teacherId: string;

  @Prop({
    required: true,
    ref: StudentEntity.name,
    index: true,
    type: Types.ObjectId,
  })
  studentId: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const ClassSubjectsSchema =
  SchemaFactory.createForClass(ClassSubjectsEntity);

export type ClassSubjectsDoc = ClassSubjectsEntity & Document<string>;

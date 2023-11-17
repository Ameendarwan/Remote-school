import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserEntity } from '@app/common/entities/auth/user.entity';
import { Types, Document } from 'mongoose';
import { ClassesEntity } from 'apps/school/src/classes/repository/entities/class.entity';
import { SchoolEntity } from 'apps/school/src/repository/entities/school.entity';
import { GradeEntity } from 'apps/school/src/grades/repository/entities/grade.entity';

export const StudentDatabaseName = 'student';

//REVIEW - use DatabaseMongoObjectIdEntityAbstract if UUID version doesn't work out
@DatabaseEntity({ collection: StudentDatabaseName })
export class StudentEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  userId: string;

  @Prop({
    required: false,
    ref: SchoolEntity.name,
    type: Types.ObjectId,
  })
  schoolId: string;

  @Prop({
    required: false,
    ref: GradeEntity.name,
    type: Types.ObjectId,
  })
  gradeId: string;

  @Prop({ type: Types.ObjectId, ref: ClassesEntity.name, required: false })
  classId: string;

  @Prop({ type: String })
  specialNeeds: string;

  @Prop({ type: Date })
  enrolledOn: Date;

  @Prop({ type: String })
  religion: string;

  @Prop({ type: Object })
  studentDetails: Record<string, any>;
}

export const StudentSchema = SchemaFactory.createForClass(StudentEntity);

StudentSchema.virtual('user', {
  ref: UserEntity.name,
  localField: 'userId',
  foreignField: '_id',
});

export type StudentDoc = StudentEntity & Document<string>;

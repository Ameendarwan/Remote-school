import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserEntity } from '@app/common/entities/auth/user.entity';
import { SchoolEntity } from 'apps/school/src/repository/entities/school.entity';
import { Document, Types } from 'mongoose';

export const TeacherDatabaseName = 'teacher';

export type TeacherEducationType = {
  university: string;
  degree: string;
  startDate: Date;
  endDate: Date;
  country: string;
  city: string;
};

//REVIEW - use DatabaseMongoObjectIdEntityAbstract if UUID version doesn't work out
@DatabaseEntity({ collection: TeacherDatabaseName, toJSON: { virtuals: true } })
export class TeacherEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: SchoolEntity.name, required: false })
  schoolId: string;

  @Prop({ type: Object })
  certifications: Record<string, any>;

  @Prop({
    required: false,
    _id: false,
    type: Object,
  })
  education?: TeacherEducationType;

  @Prop({ type: String, required: true, unique: true })
  cnic: string;

  @Prop({ type: String })
  highestQualification: string;

  @Prop({ type: Boolean, default: false })
  hasTrainingExperience: boolean;

  @Prop({ type: Number })
  experienceYears: number;

  @Prop({ type: Boolean, default: false })
  hasTakmilEducation: boolean;

  @Prop({ type: Boolean, default: false })
  isResident: boolean;

  @Prop({ type: String })
  resumeUrl: string;

  @Prop({ type: Date })
  hiredOn: Date;

  @Prop({ type: Object })
  teacherDetails: Record<string, any>;
}

export const TeacherSchema = SchemaFactory.createForClass(TeacherEntity);

TeacherSchema.virtual('user', {
  ref: UserEntity.name,
  localField: 'userId',
  foreignField: '_id',
});

export type TeacherDoc = TeacherEntity & Document<string>;

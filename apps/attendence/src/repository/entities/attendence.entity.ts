import { DatabaseMongoUUIDEntityAbstract } from '@app/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from '@app/common/database/decorators/database.decorator';
import { UserEntity } from '@app/common/entities/auth';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ClassesEntity } from 'apps/school/src/classes/repository/entities/class.entity';
import { SubjectEntity } from 'apps/school/src/subject/repository/entities/subject.entity';
import { Document, Types } from 'mongoose';

export const attendenceDatabaseName = 'attendance';

@DatabaseEntity({ collection: attendenceDatabaseName })
export class AttendenceEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: Types.ObjectId, ref: ClassesEntity.name, required: true })
  classId: string;

  @Prop({ type: Types.ObjectId, ref: SubjectEntity.name, required: false })
  subjectId: string;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  userId: string;

  @Prop({ required: true, type: Boolean })
  present: boolean;

  @Prop({ required: true, type: String })
  attendanceCode: string;

  @Prop({ required: true, type: Date })
  attendanceDate: Date;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const AttendenceSchema = SchemaFactory.createForClass(AttendenceEntity);

export type AttendenceDoc = AttendenceEntity & Document<string>;

import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAttendenceDto } from './create-attendance.dto';

class StudentAttendance {
  @IsUUID()
  @Type(() => String)
  studentId: string;

  @IsBoolean()
  @Type(() => Boolean)
  present: boolean;
}

export class MarkAttendanceDto extends OmitType(CreateAttendenceDto, [
  'userId',
  'present',
]) {
  @IsArray()
  @IsNotEmpty()
  @Type(() => StudentAttendance)
  studentAttendances: StudentAttendance[];
}

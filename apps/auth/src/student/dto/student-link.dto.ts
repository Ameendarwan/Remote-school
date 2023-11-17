import { IsUUID } from 'class-validator';

export class LinkStudentDto {
  @IsUUID()
  schoolId: string;

  @IsUUID()
  gradeId: string;

  @IsUUID()
  classId: string;
}

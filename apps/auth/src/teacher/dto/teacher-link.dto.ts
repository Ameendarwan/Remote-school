import { IsUUID } from 'class-validator';

export class LinkTeacherDto {
  @IsUUID()
  schoolId: string;
}

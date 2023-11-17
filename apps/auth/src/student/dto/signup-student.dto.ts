import { IsNotEmpty, IsUUID } from 'class-validator';

import { Type } from 'class-transformer';
import { CreateStudentDto } from './create-student.dto';

export class SignupStudentDto extends CreateStudentDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  userId: string;
}

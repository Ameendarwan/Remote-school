import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateTeacherDto } from './create-teacher.dto';
import { Type } from 'class-transformer';

export class SignupTeacherDto extends CreateTeacherDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  userId: string;
}

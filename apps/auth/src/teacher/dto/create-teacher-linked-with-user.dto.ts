import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';

export class CreateTeacherLinkedDto extends CreateTeacherDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  userId: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class CreateStudentLinkedDto extends CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

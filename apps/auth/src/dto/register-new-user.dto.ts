import {
  ValidateIf,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto, UserRole } from '../users/dto/create-user.dto';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';

//REVIEW - might not work

export class RegisterNewUserDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateIf((o) => o.user && o.user.role === UserRole.Teacher)
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTeacherDto)
  teacher?: CreateTeacherDto;

  @ValidateIf((o) => o.user && o.user.role === UserRole.Student)
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateStudentDto)
  student?: CreateStudentDto;
}

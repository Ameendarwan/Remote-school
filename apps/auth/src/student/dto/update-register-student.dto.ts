import { RegisterStudentDto } from './register-student.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRegisterStudentDto extends PartialType(RegisterStudentDto) {}

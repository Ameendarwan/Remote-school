import { PartialType } from '@nestjs/mapped-types';
import { RegisterTeacherDto } from './register-teacher.dto';

export class UpdateRegisterTeacherDto extends PartialType(RegisterTeacherDto) {}

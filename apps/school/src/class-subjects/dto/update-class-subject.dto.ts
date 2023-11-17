import { PartialType } from '@nestjs/mapped-types';
import { CreateClassSubjectsDto } from './create-class-subject.dto';

export class UpdateClassSubjectDto extends PartialType(
  CreateClassSubjectsDto,
) {}

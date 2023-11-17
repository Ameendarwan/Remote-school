import { PartialType } from '@nestjs/mapped-types';
import { CreateCurriculumBuilderDto } from './create-curriculum-builder.dto';

export class UpdateCurriculumBuilderDto extends PartialType(
  CreateCurriculumBuilderDto,
) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentLogDto } from './create-assessment-log.dto';

export class UpdateAssessmentLogDto extends PartialType(
  CreateAssessmentLogDto,
) {}

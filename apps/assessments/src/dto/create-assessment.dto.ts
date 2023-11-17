// assessment.dto.ts
import { IsString, IsOptional, IsObject, IsDate } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsString()
  subjectId: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsDate()
  effectiveAt: Date;
}

// chapters.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsDate,
} from 'class-validator';

export class CreateChaptersDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  order: number;

  @IsString()
  lesson_type: string;

  @IsString()
  subjectId: string;

  @IsString()
  curriculum_id: string;

  @IsString()
  assessment_id: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsDate()
  effectiveAt: Date;
}

import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateAssessmentLogDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  assessmentId: string;

  @IsNotEmpty()
  @IsDate()
  startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  completedAt: Date;

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsNotEmpty()
  @IsString()
  grade: string;

  @IsOptional()
  @IsString()
  comments: string;

  @IsOptional()
  @IsString()
  commentedBy: string;

  @IsOptional()
  details: Record<string, any>;

  @IsNotEmpty()
  @IsDate()
  effectiveAt: Date;
}

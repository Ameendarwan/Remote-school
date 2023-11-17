// create-question-log.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateQuestionLogDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsNotEmpty()
  @IsDate()
  startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  completedAt: Date;

  @IsNotEmpty()
  @IsString()
  response: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsNotEmpty()
  @IsString()
  grade: string;

  @IsOptional()
  @IsString()
  updatedBy: string;

  @IsOptional()
  details: Record<string, any>;

  @IsNotEmpty()
  @IsDate()
  effectiveAt: Date;
}

// create-questions.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateQuestionsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  instructions: string;

  @IsOptional()
  @IsNumber()
  score: number;

  @IsOptional()
  @IsObject()
  responses: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  assessmentId: string;

  @IsOptional()
  details: Record<string, any>;

  @IsNotEmpty()
  effectiveAt: Date;
}

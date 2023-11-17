import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCurriculumBuilderDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}

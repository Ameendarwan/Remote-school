import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsString()
  chapterId: string;

  @IsOptional()
  @IsString()
  media?: string;

  @IsString()
  assessmentId: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}

import { Type } from 'class-transformer';
import {
  IsDate,
  IsObject,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTeacherEducationDto {
  @IsOptional()
  @IsString({ message: 'University must be a string' })
  @IsNotEmpty({ message: 'University is required' })
  university?: string = '';

  @IsOptional()
  @IsString({ message: 'Degree must be a string' })
  @IsNotEmpty({ message: 'Degree is required' })
  degree?: string = '';

  @IsOptional()
  @IsDate({ message: 'Start date must be a string' })
  @IsNotEmpty({ message: 'Start date is required' })
  @Type(() => Date)
  startDate?: Date = new Date();

  @IsOptional()
  @IsDate({ message: 'End date must be a string' })
  @Type(() => Date)
  endDate?: Date = new Date();

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country is required' })
  country?: string = '';

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  city?: string = '';
}

export class CreateTeacherDto {
  @IsObject({ message: 'Certifications must be an object' })
  @IsNotEmpty({ message: 'Certifications are required' })
  @Type(() => Object)
  certifications: Record<string, any> = {};

  @IsObject({ message: 'Education must be an object' })
  @IsNotEmpty({ message: 'Education are required' })
  @Type(() => CreateTeacherEducationDto)
  @ValidateNested()
  education?: CreateTeacherEducationDto = {};

  @IsDate({ message: 'Hired date must be a valid date' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Hired date is required' })
  hiredOn = new Date();

  @IsOptional()
  @IsObject({ message: 'Details must be an object' })
  @Type(() => Object)
  teacherDetails: Record<string, any> = {};

  @IsString({ message: 'CNIC must be a string' })
  @IsNotEmpty({ message: 'CNIC is required' })
  @Type(() => String)
  cnic = '';

  @IsString({ message: 'Highest qualification must be a string' })
  @IsNotEmpty({ message: 'Highest qualification is required' })
  @Type(() => String)
  highestQualification = '';

  @IsBoolean({ message: 'Training experience must be a boolean' })
  @IsNotEmpty({ message: 'Training experience is required' })
  @Type(() => Boolean)
  hasTrainingExperience = false;

  @IsInt({ message: 'Experience years must be an integer' })
  @IsNotEmpty({ message: 'Experience years is required' })
  @Type(() => Number)
  experienceYears = 0;

  @IsBoolean({ message: 'Takmil education must be a boolean' })
  @IsNotEmpty({ message: 'Takmil education is required' })
  @Type(() => Boolean)
  hasTakmilEducation = false;

  @IsBoolean({ message: 'Resident status must be a boolean' })
  @IsNotEmpty({ message: 'Resident status is required' })
  @Type(() => Boolean)
  isResident = false;
}

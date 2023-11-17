import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class TeacherEducation {
  @IsString({ message: 'University must be a string' })
  @IsNotEmpty({ message: 'University is required' })
  @Type(() => String)
  university: string;

  @IsString({ message: 'Degree must be a string' })
  @IsNotEmpty({ message: 'Degree is required' })
  @Type(() => String)
  degree: string;

  @IsDate()
  @IsNotEmpty({ message: 'Start date is required' })
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty({ message: 'End date is required' })
  @Type(() => Date)
  endDate: Date;

  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country is required' })
  @Type(() => String)
  country: string;

  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  @Type(() => String)
  city: string;
}

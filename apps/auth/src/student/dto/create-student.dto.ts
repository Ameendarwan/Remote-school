import { Type } from 'class-transformer';
import { IsString, IsDate, IsObject } from 'class-validator';

export class CreateStudentDto {
  @IsString({ message: 'Special needs must be a string' })
  @Type(() => String)
  specialNeeds = '';

  @IsDate({ message: 'Enrollment date must be a valid date' })
  @Type(() => Date)
  enrolledOn: Date = new Date();

  @IsString({ message: 'Religion must be a string' })
  @Type(() => String)
  religion = '';

  @IsObject({ message: 'Details must be an object' })
  @Type(() => Object)
  studentDetails: Record<string, any> = {};

  // @IsOptional()
  // @IsDate({ message: 'Effective date must be a valid date' })
  // effectiveAt: Date;
}

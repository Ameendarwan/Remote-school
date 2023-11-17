import { IsString, IsUUID, IsDate, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassSubjectsDto {
  @IsString()
  @Type(() => String)
  @ApiProperty({
    required: true,
    example: 'class123',
    description: 'The ID of the class to which the subject is assigned.',
  })
  classId: string;

  @IsString()
  @IsUUID()
  @Type(() => String)
  @ApiProperty({
    required: true,
    example: 'subject456',
    description: 'The ID of the subject to be assigned to the class.',
  })
  subjectId: string;

  @IsString()
  @IsUUID()
  @Type(() => String)
  @ApiProperty({
    required: true,
    example: 'teacher789',
    description: 'The ID of the teacher responsible for the subject.',
  })
  teacherId: string;

  @IsString()
  @IsUUID()
  @Type(() => String)
  @ApiProperty({
    required: true,
    example: 'student123',
    description: 'The ID of the student associated with the subject.',
  })
  studentId: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: true,
    example: '2023-10-20T00:00:00Z',
    description: 'The start date of the subject assignment.',
  })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: true,
    example: '2023-12-31T23:59:59Z',
    description: 'The end date of the subject assignment.',
  })
  endDate: Date;

  @IsObject()
  @Type(() => Object)
  @ApiProperty({
    required: true,
    example: {
      key1: 'value1',
      key2: 'value2',
    },
    description: 'Additional details about the subject assignment.',
  })
  details: Record<string, any>;
}

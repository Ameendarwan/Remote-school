import { IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassesDto {
  @IsString()
  @ApiProperty({
    required: true,
    example: 'abc123',
    description: 'The ID of the school where the class is located.',
  })
  schoolId: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'Class A',
    description: 'The name of the class.',
  })
  name: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'This is Class A.',
    description: 'The description of the class.',
  })
  description: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'grade456',
    description: 'The ID of the grade to which the class belongs.',
  })
  gradeId: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'teacher123',
    description: 'The ID of the class teacher.',
  })
  classTeacherId: string;

  @IsObject()
  @ApiProperty({
    required: true,
    example: {
      key1: 'value1',
      key2: 'value2',
    },
    description: 'Additional details about the class.',
  })
  details: Record<string, any>;
}

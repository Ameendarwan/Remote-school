import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @ApiProperty({
    required: true,
    example: 'Mathematics',
    description: 'The curriculum of the subject.',
  })
  curriculum: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'Algebra',
    description: 'The name of the subject.',
  })
  name: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'This is a subject about algebra.',
    description: 'The description of the subject.',
  })
  description: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: '1',
    description: 'The grade ID associated with the subject.',
  })
  gradeId: string;

  @IsObject()
  @ApiProperty({
    required: true,
    example: {
      key1: 'value1',
      key2: 'value2',
    },
    description: 'Additional details about the subject.',
  })
  details: Record<string, any>;
}

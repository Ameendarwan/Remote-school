import { ApiProperty } from '@nestjs/swagger';

import { ResponseCommonSerialization } from '@app/common/response/serializations/response.common.fields.serialization';

export class ClassSubjectGetSerialization extends ResponseCommonSerialization {
  @ApiProperty({
    required: true,
    example: 'class123',
    description: 'The ID of the class to which the subject is assigned.',
  })
  classId: string;

  @ApiProperty({
    required: true,
    example: 'subject456',
    description: 'The ID of the subject to be assigned to the class.',
  })
  subjectId: string;

  @ApiProperty({
    required: true,
    example: 'teacher789',
    description: 'The ID of the teacher responsible for the subject.',
  })
  teacherId: string;

  @ApiProperty({
    required: true,
    example: 'student123',
    description: 'The ID of the student associated with the subject.',
  })
  studentId: string;

  @ApiProperty({
    required: true,
    example: '2023-10-20T00:00:00Z',
    description: 'The start date of the subject assignment.',
  })
  startDate: Date;

  @ApiProperty({
    required: true,
    example: '2023-12-31T23:59:59Z',
    description: 'The end date of the subject assignment.',
  })
  endDate: Date;

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

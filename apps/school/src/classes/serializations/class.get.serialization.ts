import { ApiProperty } from '@nestjs/swagger';

import { ResponseCommonSerialization } from '@app/common/response/serializations/response.common.fields.serialization';

export class ClassGetSerialization extends ResponseCommonSerialization {
  @ApiProperty({
    required: true,
    example: 'abc123',
    description: 'The ID of the school where the class is located.',
  })
  schoolId: string;

  @ApiProperty({
    required: true,
    example: 'Class A',
    description: 'The name of the class.',
  })
  name: string;

  @ApiProperty({
    required: true,
    example: 'This is Class A.',
    description: 'The description of the class.',
  })
  description: string;

  @ApiProperty({
    required: true,
    example: 'grade456',
    description: 'The ID of the grade to which the class belongs.',
  })
  gradeId: string;

  @ApiProperty({
    required: true,
    example: 'teacher123',
    description: 'The ID of the class teacher.',
  })
  classTeacherId: string;

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

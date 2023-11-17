import { ApiProperty } from '@nestjs/swagger';

import { ResponseCommonSerialization } from '@app/common/response/serializations/response.common.fields.serialization';

export class SubjectGetSerialization extends ResponseCommonSerialization {
  @ApiProperty({
    required: true,
    example: 'Mathematics',
    description: 'The curriculum of the subject.',
  })
  curriculum: string;

  @ApiProperty({
    required: true,
    example: 'Algebra',
    description: 'The name of the subject.',
  })
  name: string;

  @ApiProperty({
    required: true,
    example: 'This is a subject about algebra.',
    description: 'The description of the subject.',
  })
  description: string;

  @ApiProperty({
    required: true,
    example: '1',
    description: 'The grade ID associated with the subject.',
  })
  gradeId: string;

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

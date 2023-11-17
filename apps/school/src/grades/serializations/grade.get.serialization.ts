import { ApiProperty } from '@nestjs/swagger';

import { ResponseCommonSerialization } from '@app/common/response/serializations/response.common.fields.serialization';

export class GradeGetSerialization extends ResponseCommonSerialization {
  @ApiProperty({
    required: true,
    example: 'a7a255cf-1d13-4bb4-8c48-9ff5c306b0d0',
    description: 'The organization ID associated with the grade.',
  })
  organizationId: string;

  @ApiProperty({
    required: false,
    example: 'Grade A',
    description: 'The name of the grade (optional).',
  })
  name: string;

  @ApiProperty({
    required: false,
    example: 'This is Grade A.',
    description: 'The description of the grade (optional).',
  })
  description: string;

  @ApiProperty({
    required: false,
    example: {
      key1: 'value1',
      key2: 'value2',
    },
    description: 'Additional details about the grade (optional).',
  })
  details: Record<string, any>;
}

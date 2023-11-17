import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ResponseCommonSerialization } from '@app/common/response/serializations/response.common.fields.serialization';

export class OrganizationGetSerialization extends ResponseCommonSerialization {
  @ApiProperty({ required: true, example: 'Example Organization Ltd.' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  @ApiProperty({
    example: {
      website: 'https://example.org',
      address: '123 Main St',
      contact: 'contact@example.org',
    },
  })
  @IsObject({ message: 'Details must be an object' })
  @IsOptional()
  readonly details: Record<string, any>;
}

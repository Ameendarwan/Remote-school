import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ required: true, example: 'Example Organization Ltd.' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    example: {
      website: 'https://example.org',
      address: '123 Main St',
      contact: 'contact@example.org',
    },
  })
  @IsObject({ message: 'Details must be an object' })
  @IsOptional()
  details: Record<string, any>;
}

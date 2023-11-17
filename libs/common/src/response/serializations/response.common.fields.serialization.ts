import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';

export class ResponseCommonSerialization {
  @ApiProperty({
    description: 'Id that representative with your target data',
    example: faker.string.uuid(),
    required: true,
    nullable: false,
  })
  @Type(() => String)
  _id: string;

  @ApiProperty({
    description: 'Document updated by if [probably admin]',
    example: 'admin_user_id',
    required: true,
    nullable: false,
  })
  readonly updatedBy: string;

  @ApiProperty({
    description: 'Date for document to be effective at',
    example: new Date().toISOString(),
    required: true,
    nullable: false,
  })
  readonly effectiveAt: Date;

  @ApiProperty({
    description: 'Date created at',
    example: new Date().toISOString(),
    required: true,
    nullable: false,
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Date updated at',
    example: new Date().toISOString(),
    required: true,
    nullable: false,
  })
  readonly updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly deletedAt?: Date;
}

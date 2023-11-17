import { AddressGetSerialization } from '@app/common/modules/address/serializations/address.get.serialization';
import { ResponseCommonSerialization } from '@app/common/response/serializations/response.common.fields.serialization';
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrganizationGetSerialization } from '../organization/serializations/organization.get.serialization';

export class SchoolGetSerialization extends ResponseCommonSerialization {
  @ApiProperty({
    example: faker.company.name(),
    required: true,
  })
  @Type(() => String)
  name: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @Type(() => String)
  model: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @Type(() => String)
  status: string;

  @ApiProperty({
    example: faker.number.int({ min: 0, max: 1 }),
  })
  @Type(() => Number)
  offline: number;

  @ApiProperty({
    example: faker.date.past(),
  })
  @Type(() => Date)
  started: Date;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @Type(() => String)
  electricity: string;

  @ApiProperty({
    example: faker.internet.url(),
  })
  @Type(() => String)
  internet: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @Type(() => String)
  schoolType: string;

  @ApiProperty({
    example: faker.number.int(),
  })
  @Type(() => Number)
  estimatedHousehold: number;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @Type(() => String)
  spaceType: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @Type(() => String)
  nearestSchool: string;

  @ApiProperty({
    example: {
      anyField: 'anyValue',
    },
  })
  @Type(() => Object)
  details: Record<string, any>;

  @ApiProperty({
    type: OrganizationGetSerialization,
    required: true,
    nullable: false,
    default: [],
  })
  @Type(() => OrganizationGetSerialization)
  readonly organization: OrganizationGetSerialization;

  @ApiProperty({
    type: AddressGetSerialization,
    required: true,
    nullable: false,
    default: [],
  })
  @Type(() => AddressGetSerialization)
  readonly address: AddressGetSerialization;
}

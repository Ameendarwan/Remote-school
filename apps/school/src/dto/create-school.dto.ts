import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class CreateSchoolDto {
  @ApiProperty({
    example: faker.company.name(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty({ message: 'addressId is required' })
  @IsUUID()
  @Type(() => String)
  addressId: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @IsString()
  @Type(() => String)
  model: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  status: string;

  @ApiProperty({
    example: faker.number.int({ min: 0, max: 1 }),
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offline: number;

  @ApiProperty({
    example: faker.date.past(),
  })
  @IsOptional()
  @Type(() => Date)
  started: Date;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  electricity: string;

  @ApiProperty({
    example: faker.internet.url(),
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  internet: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  schoolType: string;

  @ApiProperty({
    example: faker.number.int(),
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  estimatedHousehold: number;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  spaceType: string;

  @ApiProperty({
    example: faker.lorem.word(),
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  nearestSchool: string;

  @ApiProperty({
    example: faker.datatype.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  organizationId: string;

  @ApiProperty({
    example: {
      anyField: 'anyValue',
    },
  })
  @IsOptional()
  @IsObject()
  @Type(() => Object)
  details: Record<string, any>;
}

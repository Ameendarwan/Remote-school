import { UpdateAddressDto } from '@app/common/modules/address/dto/update-address.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { UpdateOrganizationDto } from '../organization/dto/update-organization.dto';
import { CreateSchoolDto } from './create-school.dto';

export class SchoolUpdateDto extends PartialType(
  OmitType(CreateSchoolDto, ['addressId']),
) {
  @ApiProperty({
    type: UpdateAddressDto,
    required: false,
    example: {
      street: '123 Main Street',
      street1: 'Apt 4B',
      council: 'Council Name',
      town: 'Town Name',
      tehsil: 'Tehsil Name',
      district: 'District Name',
      county: 'County Name',
      state: 'State Name',
      country: 'Country Name',
      latitude: 42.123456,
      longitude: -71.654321,
      addressDetails: {
        detail1: 'value1',
        detail2: 'value2',
      },
    },
  })
  @IsOptional()
  @IsObject({ message: 'address must be an object' })
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;

  @ApiProperty({
    type: UpdateOrganizationDto,
    required: false,
    example: {
      name: 'Example Organization Name',
      details: {
        key1: 'value1',
        key2: 'value2',
      },
    },
  })
  @IsOptional()
  @IsObject({ message: 'organization must be an object' })
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrganizationDto)
  organization?: UpdateOrganizationDto;
}

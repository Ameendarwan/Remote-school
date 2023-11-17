import { CreateAddressDto } from '@app/common/modules/address/dto/create-address.dto';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested, IsNotEmptyObject } from 'class-validator';
import { CreateSchoolDto } from './create-school.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateOrganizationDto } from '../organization/dto/create-organization.dto';

export class SchoolCreateDto extends OmitType(CreateSchoolDto, [
  'addressId',
  'organizationId',
]) {
  @ApiProperty({
    type: CreateAddressDto,
    required: true,
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
  @IsObject({ message: 'address must be an object' })
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({
    type: CreateOrganizationDto,
    required: true,
    example: {
      name: 'Example Organization Name',
      details: {
        key1: 'value1',
        key2: 'value2',
      },
    },
  })
  @IsObject({ message: 'organization must be an object' })
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => CreateOrganizationDto)
  organization: CreateOrganizationDto;
}

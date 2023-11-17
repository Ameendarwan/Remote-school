import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

//TODO - fix this, assigned empty values so that it could get picked up by extract helper function - but this not letting me to validate empty object
export class CreateAddressDto {
  @ApiProperty({ required: true, example: '123 Main Street' })
  @IsString({ message: 'Street must be a string' })
  street: string;

  @ApiProperty({ required: true, example: 'Apt 4B' })
  @IsString({ message: 'Street1 must be a string' })
  street1: string;

  @ApiProperty({ example: 'Council Name' })
  @IsString({ message: 'Council must be a string' })
  @IsOptional()
  council?: string;

  @ApiProperty({ example: 'Townsville' })
  @IsString({ message: 'Town must be a string' })
  @IsOptional()
  town?: string;

  @ApiProperty({ example: 'Tehsil Area' })
  @IsString({ message: 'Tehsil must be a string' })
  @IsOptional()
  tehsil?: string;

  @ApiProperty({ example: 'Districtville' })
  @IsString({ message: 'District must be a string' })
  @IsOptional()
  district?: string;

  @ApiProperty({ example: 'County County' })
  @IsString()
  @IsOptional()
  county?: string;

  @ApiProperty({ example: 'State Province' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Country Nation' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 42.123456 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -71.654321 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: { key1: 'value1', key2: 'value2' } })
  @IsObject({ message: 'Details must be an object' })
  @IsOptional()
  addressDetails?: Record<string, any>;

  constructor(assignDefaults = false) {
    if (assignDefaults) {
      this.street = '';
      this.street1 = '';
      this.council = '';
      this.town = '';
      this.tehsil = '';
      this.district = '';
      this.county = '';
      this.state = '';
      this.country = '';
      this.latitude = 0;
      this.longitude = 0;
    }
    this.addressDetails = {};
  }
}

import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

import { ResponseCommonSerialization } from '@app/common/response/serializations/response.common.fields.serialization';

export class AddressGetSerialization extends ResponseCommonSerialization {
  @ApiProperty({ required: true, example: '123 Main Street' })
  @IsString({ message: 'Street must be a string' })
  readonly street: string;

  @ApiProperty({ required: true, example: 'Apt 4B' })
  @IsString({ message: 'Street1 must be a string' })
  readonly street1: string;

  @ApiProperty({ example: 'Council Name' })
  @IsString({ message: 'Council must be a string' })
  @IsOptional()
  readonly council?: string;

  @ApiProperty({ example: 'Townsville' })
  @IsString({ message: 'Town must be a string' })
  @IsOptional()
  readonly town?: string;

  @ApiProperty({ example: 'Tehsil Area' })
  @IsString({ message: 'Tehsil must be a string' })
  @IsOptional()
  readonly tehsil?: string;

  @ApiProperty({ example: 'Districtville' })
  @IsString({ message: 'District must be a string' })
  @IsOptional()
  readonly district?: string;

  @ApiProperty({ example: 'County County' })
  @IsString()
  @IsOptional()
  readonly county?: string;

  @ApiProperty({ example: 'State Province' })
  @IsString()
  @IsOptional()
  readonly state?: string;

  @ApiProperty({ example: 'Country Nation' })
  @IsString()
  @IsOptional()
  readonly country?: string;

  @ApiProperty({ example: 42.123456 })
  @IsNumber()
  @IsOptional()
  readonly latitude?: number;

  @ApiProperty({ example: -71.654321 })
  @IsNumber()
  @IsOptional()
  readonly longitude?: number;

  @ApiProperty({ example: { key1: 'value1', key2: 'value2' } })
  @IsObject({ message: 'Details must be an object' })
  @IsOptional()
  readonly addressDetails?: Record<string, any>;
}

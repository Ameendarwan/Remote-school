import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from '../../../../../libs/common/src/modules/address/dto/create-address.dto';

import { Type } from 'class-transformer';
import { IsEitherUsernameOrEmail } from '../../student/dto/register-student.dto';
import { CreateUserWithNoRoleDto } from '../../users/dto/create-user-no-role.dto';
import {
  CreateTeacherDto,
  CreateTeacherEducationDto,
} from './create-teacher.dto';

//FIXME - Fix this is hell to update parent dto's seperately everytime there is change

interface CombinedDto
  extends CreateUserWithNoRoleDto,
    CreateTeacherDto,
    CreateAddressDto {}

export class RegisterTeacherDto implements CombinedDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Username or email is required' })
  @ValidateIf((o, value) => IsEitherUsernameOrEmail(value, o))
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @ValidateIf((o, value) => IsEitherUsernameOrEmail(value, o))
  email?: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'Middle name must be a string' })
  middleName?: string;

  @IsNotEmpty({ message: 'Birth date is required' })
  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsString({ message: 'Gender must be a string' })
  gender: string;

  @IsString({ message: 'Image URL must be a string' })
  imageUrl: string;

  @IsNotEmpty({ message: 'Primary phone is required' })
  @IsString({ message: 'Primary phone must be a string' })
  primaryPhone: string;

  @IsOptional()
  @IsString({ message: 'Secondary phone must be a string' })
  secondaryPhone?: string;

  @IsNotEmpty({ message: 'Is disabled flag is required' })
  @IsBoolean({ message: 'Is disabled must be a boolean' })
  isDisabled: boolean;

  @IsObject({ message: 'Address must be an object' })
  @IsNotEmpty({ message: 'User details are required' })
  userDetails: Record<string, any>;

  @IsObject({ message: 'Certifications must be an object' })
  @IsNotEmpty({ message: 'Certifications are required' })
  certifications: Record<string, any>;

  @IsObject({ message: 'Education must be an object' })
  @IsNotEmpty({ message: 'Education are required' })
  @Type(() => CreateTeacherEducationDto)
  @ValidateNested({ each: true })
  education: CreateTeacherEducationDto;

  @IsDate({ message: 'Hired date must be a valid date' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Hired date is required' })
  hiredOn: Date;

  @IsOptional()
  @IsObject({ message: 'Details must be an object' })
  teacherDetails: Record<string, any>;

  @IsNotEmpty({ message: 'Street is required' })
  @IsString({ message: 'Street must be a string' })
  street: string;

  @IsOptional()
  @IsString({ message: 'Street1 must be a string' })
  street1: string;

  @IsNotEmpty({ message: 'Council is required' })
  @IsString({ message: 'Council must be a string' })
  council: string;

  @IsNotEmpty({ message: 'Town is required' })
  @IsString({ message: 'Town must be a string' })
  town: string;

  @IsNotEmpty({ message: 'Tehsil is required' })
  @IsString({ message: 'Tehsil must be a string' })
  tehsil: string;

  @IsNotEmpty({ message: 'District is required' })
  @IsString({ message: 'District must be a string' })
  district: string;

  @IsOptional()
  @IsNotEmpty({ message: 'County is required' })
  @IsString({ message: 'County must be a string' })
  county: string;

  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State must be a string' })
  state: string;

  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Latitude is required' })
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Longitude is required' })
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude: number;

  @IsObject({ message: 'Address must be an object' })
  @IsNotEmpty({ message: 'Address details are required' })
  addressDetails: Record<string, any>;

  @IsString({ message: 'CNIC must be a string' })
  @IsNotEmpty({ message: 'CNIC is required' })
  @Type(() => String)
  cnic: string;

  @IsString({ message: 'Highest qualification must be a string' })
  @IsNotEmpty({ message: 'Highest qualification is required' })
  @Type(() => String)
  highestQualification: string;

  @IsBoolean({ message: 'Training experience must be a boolean' })
  @IsNotEmpty({ message: 'Training experience is required' })
  @Type(() => Boolean)
  hasTrainingExperience: boolean;

  @IsInt({ message: 'Experience years must be an integer' })
  @IsNotEmpty({ message: 'Experience years is required' })
  @Type(() => Number)
  experienceYears: number;

  @IsBoolean({ message: 'Takmil education must be a boolean' })
  @IsNotEmpty({ message: 'Takmil education is required' })
  @Type(() => Boolean)
  hasTakmilEducation: boolean;

  @IsBoolean({ message: 'Resident status must be a boolean' })
  @IsNotEmpty({ message: 'Resident status is required' })
  @Type(() => Boolean)
  isResident: boolean;
}

import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsObject,
  IsDate,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { CreateAddressDto } from '../../../../../libs/common/src/modules/address/dto/create-address.dto';
import { CreateStudentDto } from './create-student.dto';
import { CreateUserWithNoRoleDto } from '../../users/dto/create-user-no-role.dto';

export function IsEitherUsernameOrEmail(value: any, args: any) {
  const username = args.username;
  const email = args.email;

  console.log('Username:', username);
  console.log('Email:', email);

  const hasUsername = typeof username === 'string' && username.trim() !== '';
  const hasEmail = typeof email === 'string' && email.trim() !== '';

  console.log('Has Username:', hasUsername);
  console.log('Has Email:', hasEmail);

  return hasUsername || hasEmail;
}

interface CombinedDto
  extends CreateUserWithNoRoleDto,
    CreateStudentDto,
    CreateAddressDto {}

export class RegisterStudentDto implements CombinedDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsString({ message: 'Username must be a string' })
  @ValidateIf((o, value) => IsEitherUsernameOrEmail(value, o))
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

  @IsString({ message: 'Special needs must be a string' })
  specialNeeds: string;

  @IsNotEmpty({ message: 'Enrollment date is required' })
  @Type(() => Date)
  @IsDate()
  enrolledOn: Date;

  @IsNotEmpty({ message: 'Student details are required' })
  @IsObject({ message: 'Student must be an object' })
  studentDetails: Record<string, any>;

  @IsNotEmpty({ message: 'Religion is required' })
  @IsString({ message: 'Religion must be a string' })
  religion: string;

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

  @IsNotEmpty({ message: 'Address details are required' })
  @IsObject({ message: 'Address must be an object' })
  addressDetails: Record<string, any>;
}

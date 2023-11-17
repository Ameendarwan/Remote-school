import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IsEitherUsernameOrEmail } from '../../student/dto/register-student.dto';

export enum UserRole {
  Teacher = 'teacher',
  Student = 'student',
}

export class CreateUserDto {
  @IsOptional()
  @ValidateIf((o, value) => IsEitherUsernameOrEmail(value, o))
  @IsString({ message: 'Username must be a string' })
  @Type(() => String)
  username? = '';

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  @Type(() => String)
  email? = '';

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Type(() => String)
  password = '';

  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Type(() => String)
  firstName = '';

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Type(() => String)
  lastName = '';

  @IsOptional()
  @IsString({ message: 'Middle name must be a string' })
  @IsNotEmpty({ message: 'Middle name is required' })
  @Type(() => String)
  middleName? = '';

  @IsOptional()
  @IsDate({ message: 'Birth date must be a valid date' })
  @Type(() => Date)
  birthDate: Date = null;

  @IsString({ message: 'Gender must be a string' })
  @IsNotEmpty({ message: 'Gender is required' })
  @Type(() => String)
  gender = '';

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  @Type(() => String)
  imageUrl = '';

  @IsOptional()
  @IsString({ message: 'Primary phone must be a string' })
  @Type(() => String)
  primaryPhone = '';

  @IsOptional()
  @IsString({ message: 'Secondary phone must be a string' })
  @Type(() => String)
  secondaryPhone? = '';

  @IsOptional()
  @IsObject({ message: 'Details must be an object' })
  @Type(() => Object)
  userDetails: Record<string, any> = {};
}

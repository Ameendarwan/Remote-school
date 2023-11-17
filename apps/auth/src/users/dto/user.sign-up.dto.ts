import { IsString, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';

export enum UserRole {
  Teacher = 'teacher',
  Student = 'student',
}

export class SignupUserDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Type(() => String)
  addressId: string;

  @IsNotEmpty()
  @Type(() => String)
  @IsEnum(UserRole)
  role: UserRole;
}

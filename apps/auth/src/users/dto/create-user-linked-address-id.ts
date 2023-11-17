import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export enum UserRole {
  Teacher = 'teacher',
  Student = 'student',
}

export class CreateUserLinkedWithAddressIdDto extends CreateUserDto {
  @IsNotEmpty({ message: 'Address ID is required' })
  @IsString({ message: 'Address ID must be a string' })
  addressId: string;

  @IsEnum(UserRole)
  role: UserRole;
}

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UserChangePasswordDto {
  @IsNotEmpty()
  @MaxLength(50)
  readonly newPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;
}

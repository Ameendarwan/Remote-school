import { ValidateIf, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEitherUsernameOrEmail } from '../../student/dto/register-student.dto';
import { CreateUserDto } from './create-user.dto';

export class SeedUserDto extends CreateUserDto {
  @ValidateIf((o, value) => IsEitherUsernameOrEmail(value, o))
  @IsUUID()
  @Type(() => String)
  addressId: string;
}

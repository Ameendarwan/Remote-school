import { IsNotEmpty } from 'class-validator';

import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';

//REVIEW - might not work

export class UserLoginDto extends PickType(CreateUserDto, [
  'password',
] as const) {
  @IsNotEmpty({ message: 'Username or email is required' })
  usernameOrEmail: string;
}

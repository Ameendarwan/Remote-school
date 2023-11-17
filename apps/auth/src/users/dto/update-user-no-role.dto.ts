import { PartialType } from '@nestjs/mapped-types';
import { CreateUserWithNoRoleDto } from './create-user-no-role.dto';

export class UpdateCreateUserWithNoRoleDto extends PartialType(
  CreateUserWithNoRoleDto,
) {}

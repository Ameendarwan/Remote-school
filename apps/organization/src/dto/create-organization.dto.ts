import { IsObject, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsObject()
  details: Record<string, any>;
}

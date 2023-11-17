import { PartialType } from '@nestjs/mapped-types';
import { CreateClassesDto } from './create-class.dto';

export class UpdateClassesDto extends PartialType(CreateClassesDto) {}

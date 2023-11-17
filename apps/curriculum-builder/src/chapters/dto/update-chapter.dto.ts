import { PartialType } from '@nestjs/mapped-types';
import { CreateChaptersDto } from './create-chapter.dto';

export class UpdateChaptersDto extends PartialType(CreateChaptersDto) {}

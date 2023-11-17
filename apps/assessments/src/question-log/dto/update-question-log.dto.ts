import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionLogDto } from './create-question-log.dto';

export class UpdateQuestionLogDto extends PartialType(CreateQuestionLogDto) {}

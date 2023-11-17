import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionsDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionsDto) {}

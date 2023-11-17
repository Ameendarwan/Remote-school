import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionLogService } from './question-log.service';
import { CreateQuestionLogDto } from './dto/create-question-log.dto';
import { UpdateQuestionLogDto } from './dto/update-question-log.dto';

@Controller('question-log')
export class QuestionLogController {
  constructor(private readonly questionLogService: QuestionLogService) {}

  @Post()
  create(@Body() createQuestionLogDto: CreateQuestionLogDto) {
    return this.questionLogService.create(createQuestionLogDto);
  }

  @Get()
  findAll() {
    return this.questionLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionLogService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionLogDto: UpdateQuestionLogDto,
  ) {
    return this.questionLogService.update(id, updateQuestionLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionLogService.softDelete(id);
  }
}

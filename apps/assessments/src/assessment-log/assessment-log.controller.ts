import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssessmentLogService } from './assessment-log.service';
import { CreateAssessmentLogDto } from './dto/create-assessment-log.dto';
import { UpdateAssessmentLogDto } from './dto/update-assessment-log.dto';

@Controller('assessment-log')
export class AssessmentLogController {
  constructor(private readonly assessmentLogService: AssessmentLogService) {}

  @Post()
  create(@Body() createAssessmentLogDto: CreateAssessmentLogDto) {
    return this.assessmentLogService.create(createAssessmentLogDto);
  }

  @Get()
  findAll() {
    return this.assessmentLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentLogService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssessmentLogDto: UpdateAssessmentLogDto,
  ) {
    return this.assessmentLogService.update(id, updateAssessmentLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentLogService.softDelete(id);
  }
}

import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassSubjectsService } from './class-subjects.service';
import { UpdateClassSubjectDto } from './dto/update-class-subject.dto';
import { CreateClassSubjectsDto } from './dto/create-class-subject.dto';
import {
  ClassSubjectCreateDoc,
  ClassSubjectListDoc,
  ClassSubjectGetDoc,
  ClassSubjectUpdateDoc,
  ClassSubjectDeleteDoc,
} from './docs/class.subject.public.doc';

@ApiTags('modules.public.class-subjects')
@Controller({
  version: '1',
  path: '/class-subjects',
})
export class ClassSubjectsController {
  constructor(private readonly classSubjectsService: ClassSubjectsService) {}
  @ClassSubjectCreateDoc()
  @Post()
  create(@Body() createClassSubjectDto: CreateClassSubjectsDto) {
    return this.classSubjectsService.create(createClassSubjectDto);
  }
  @ClassSubjectListDoc()
  @Get()
  findAll() {
    return this.classSubjectsService.findAll();
  }
  @ClassSubjectGetDoc()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSubjectsService.findById(id);
  }
  @ClassSubjectUpdateDoc()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassSubjectDto: UpdateClassSubjectDto,
  ) {
    const classSubjects = await this.classSubjectsService.findById(id);
    return this.classSubjectsService.update(
      classSubjects,
      updateClassSubjectDto,
    );
  }
  @ClassSubjectDeleteDoc()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSubjectsService.softDelete(id);
  }
}

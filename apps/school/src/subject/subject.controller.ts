import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import {
  SubjectCreateDoc,
  SubjectListDoc,
  SubjectUpdateDoc,
  SubjectDeleteDoc,
  SubjectGetDoc,
} from './docs/school.public.doc';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modules.public.subject')
@Controller({
  version: '1',
  path: '/subject',
})
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}
  @SubjectCreateDoc()
  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }
  @SubjectListDoc()
  @Get()
  findAll() {
    return this.subjectService.findAll();
  }
  @SubjectGetDoc()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findById(id);
  }
  @SubjectUpdateDoc()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.subjectService.findById(id);

    return this.subjectService.update(subject, updateSubjectDto);
  }
  @SubjectDeleteDoc()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectService.softDelete(id);
  }
}

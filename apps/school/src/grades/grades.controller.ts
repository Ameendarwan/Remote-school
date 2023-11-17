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
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeService } from './grades.service';
import {
  GradeCreateDoc,
  GradeListDoc,
  GradeGetDoc,
  GradeUpdateDoc,
  GradeDeleteDoc,
} from './docs/grade.public.doc';

@ApiTags('modules.public.grades')
@Controller({
  version: '1',
  path: '/grades',
})
export class GradesController {
  constructor(private readonly gradesService: GradeService) {}
  @GradeCreateDoc()
  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }
  @GradeListDoc()
  @Get()
  findAll() {
    return this.gradesService.findAll();
  }

  //TODO - add proper doc decorator for below
  @GradeCreateDoc()
  @Get('with-classes')
  findAllWithClasses() {
    return this.gradesService.findAllWithClasses();
  }
  @GradeGetDoc()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradesService.findById(id);
  }
  @GradeUpdateDoc()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    const grade = await this.gradesService.findById(id);
    return this.gradesService.update(grade, updateGradeDto);
  }
  @GradeDeleteDoc()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradesService.softDelete(id);
  }
}

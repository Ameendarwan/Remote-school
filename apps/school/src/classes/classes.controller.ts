import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassesDto } from './dto/create-class.dto';
import { UpdateClassesDto } from './dto/update-class.dto';
import {
  ClassCreateDoc,
  ClassListDoc,
  ClassGetDoc,
  ClassUpdateDoc,
  ClassDeleteDoc,
} from './docs/class.public.doc';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modules.public.classes')
@Controller({
  version: '1',
  path: '/classes',
})
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @ClassCreateDoc()
  @Post()
  create(@Body() createClassDto: CreateClassesDto) {
    return this.classesService.create(createClassDto);
  }
  @ClassListDoc()
  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  // TODO - add proper decorator for below
  @ClassCreateDoc()
  @Get('by-grade/:gradeId')
  fetchByGrade(@Param('gradeId') id: string) {
    return this.classesService.findByGradeId(id);
  }
  @ClassGetDoc()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findById(id);
  }
  @ClassUpdateDoc()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassesDto,
  ) {
    const classes = await this.classesService.findById(id);
    return this.classesService.update(classes, updateClassDto);
  }
  @ClassDeleteDoc()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.softDelete(id);
  }
}

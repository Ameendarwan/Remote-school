import { CurriculumBuilderService } from './curriculum-builder.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UpdateCurriculumBuilderDto } from './dto/update-curriculum-builder.dto';
import { CreateCurriculumBuilderDto } from './dto/create-curriculum-builder.dto';

@Controller('curriculum-builder')
export class CurriculumBuilderController {
  constructor(
    private readonly curriculumBuilderService: CurriculumBuilderService,
  ) {}

  @Post()
  create(@Body() createCurriculumBuilderDto: CreateCurriculumBuilderDto) {
    return this.curriculumBuilderService.create(createCurriculumBuilderDto);
  }

  @Get()
  findAll() {
    return this.curriculumBuilderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.curriculumBuilderService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurriculumBuilderDto: UpdateCurriculumBuilderDto,
  ) {
    return this.curriculumBuilderService.update(id, updateCurriculumBuilderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.curriculumBuilderService.softDelete(id);
  }
}

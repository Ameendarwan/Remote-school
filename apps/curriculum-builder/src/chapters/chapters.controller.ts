import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChaptersDto } from './dto/create-chapter.dto';
import { UpdateChaptersDto } from './dto/update-chapter.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  create(@Body() createChapterDto: CreateChaptersDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Get('by-subject/:subjectId')
  findAllBySubject(@Param('subjectId') subjectId: string) {
    return this.chaptersService.findAllBySubject(subjectId);
  }

  @Get()
  findAll() {
    return this.chaptersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChapterDto: UpdateChaptersDto,
  ) {
    const chapters = await this.chaptersService.findById(id);
    return this.chaptersService.update(chapters, updateChapterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chaptersService.softDelete(id);
  }
}

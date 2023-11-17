import { Controller, Get } from '@nestjs/common';
import { LessonBuilderService } from './lesson-builder.service';

@Controller()
export class LessonBuilderController {
  constructor(private readonly lessonBuilderService: LessonBuilderService) {}

  @Get()
  getHello(): string {
    return this.lessonBuilderService.getHello();
  }
}

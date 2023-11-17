import { Module } from '@nestjs/common';
import { LessonBuilderController } from './lesson-builder.controller';
import { LessonBuilderService } from './lesson-builder.service';

@Module({
  imports: [],
  controllers: [LessonBuilderController],
  providers: [LessonBuilderService],
})
export class LessonBuilderModule {}

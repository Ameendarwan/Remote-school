import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonsRepository } from './repositories/lessons.repository';
import { LessonEntity, LessonSchema } from './entities/lesson.entity';

@Module({
  providers: [LessonsRepository],
  exports: [LessonsRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: LessonEntity.name,
        schema: LessonSchema,
      },
    ]),
  ],
})
export class LessonsRepositoryModule {}

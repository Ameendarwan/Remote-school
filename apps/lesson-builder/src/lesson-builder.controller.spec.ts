import { Test, TestingModule } from '@nestjs/testing';
import { LessonBuilderController } from './lesson-builder.controller';
import { LessonBuilderService } from './lesson-builder.service';

describe('LessonBuilderController', () => {
  let lessonBuilderController: LessonBuilderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LessonBuilderController],
      providers: [LessonBuilderService],
    }).compile();

    lessonBuilderController = app.get<LessonBuilderController>(
      LessonBuilderController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(lessonBuilderController.getHello()).toBe('Hello World!');
    });
  });
});

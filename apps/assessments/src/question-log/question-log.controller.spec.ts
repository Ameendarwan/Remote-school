import { Test, TestingModule } from '@nestjs/testing';
import { QuestionLogController } from './question-log.controller';
import { QuestionLogService } from './question-log.service';

describe('QuestionLogController', () => {
  let controller: QuestionLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionLogController],
      providers: [QuestionLogService],
    }).compile();

    controller = module.get<QuestionLogController>(QuestionLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

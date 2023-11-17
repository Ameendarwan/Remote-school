import { Test, TestingModule } from '@nestjs/testing';
import { QuestionLogService } from './question-log.service';

describe('QuestionLogService', () => {
  let service: QuestionLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionLogService],
    }).compile();

    service = module.get<QuestionLogService>(QuestionLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentLogService } from './assessment-log.service';

describe('AssessmentLogService', () => {
  let service: AssessmentLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentLogService],
    }).compile();

    service = module.get<AssessmentLogService>(AssessmentLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

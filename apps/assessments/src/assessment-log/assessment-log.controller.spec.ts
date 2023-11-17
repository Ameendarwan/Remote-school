import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentLogController } from './assessment-log.controller';
import { AssessmentLogService } from './assessment-log.service';

describe('AssessmentLogController', () => {
  let controller: AssessmentLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentLogController],
      providers: [AssessmentLogService],
    }).compile();

    controller = module.get<AssessmentLogController>(AssessmentLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

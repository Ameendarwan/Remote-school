import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumBuilderService } from './curriculum-builder.service';

describe('CurriculumBuilderService', () => {
  let service: CurriculumBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurriculumBuilderService],
    }).compile();

    service = module.get<CurriculumBuilderService>(CurriculumBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

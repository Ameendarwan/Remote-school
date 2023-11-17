import { Test, TestingModule } from '@nestjs/testing';
import { ClassSubjectsService } from './class-subjects.service';

describe('ClassSubjectsService', () => {
  let service: ClassSubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassSubjectsService],
    }).compile();

    service = module.get<ClassSubjectsService>(ClassSubjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

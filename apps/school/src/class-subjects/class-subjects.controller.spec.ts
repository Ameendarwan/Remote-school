import { Test, TestingModule } from '@nestjs/testing';
import { ClassSubjectsController } from './class-subjects.controller';
import { ClassSubjectsService } from './class-subjects.service';

describe('ClassSubjectsController', () => {
  let controller: ClassSubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassSubjectsController],
      providers: [ClassSubjectsService],
    }).compile();

    controller = module.get<ClassSubjectsController>(ClassSubjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

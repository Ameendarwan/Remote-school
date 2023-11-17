import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumBuilderController } from './curriculum-builder.controller';
import { CurriculumBuilderService } from './curriculum-builder.service';

describe('CurriculumBuilderController', () => {
  let controller: CurriculumBuilderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurriculumBuilderController],
      providers: [CurriculumBuilderService],
    }).compile();

    controller = module.get<CurriculumBuilderController>(
      CurriculumBuilderController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

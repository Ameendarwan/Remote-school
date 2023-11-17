// assessment-log.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAssessmentLogDto } from './dto/create-assessment-log.dto';
import { UpdateAssessmentLogDto } from './dto/update-assessment-log.dto';
import { AssessmentLogRepository } from './repository/repositories/assessment-log.repository';
import { AssessmentLogEntity } from './repository/entities/assessment-log.entity';

@Injectable()
export class AssessmentLogService {
  constructor(
    private readonly assessmentLogRepository: AssessmentLogRepository,
  ) {}

  async create(
    createAssessmentLogDto: CreateAssessmentLogDto,
  ): Promise<AssessmentLogEntity> {
    return this.assessmentLogRepository.create(createAssessmentLogDto);
  }

  async findById(id: string): Promise<AssessmentLogEntity | null> {
    return this.assessmentLogRepository.findOne({ _id: id });
  }

  async findAll(): Promise<AssessmentLogEntity[]> {
    return this.assessmentLogRepository.findAll({});
  }

  async update(
    id: string,
    updateAssessmentLogDto: UpdateAssessmentLogDto,
  ): Promise<AssessmentLogEntity | null> {
    return this.assessmentLogRepository.findByIdAndUpdate(
      id,
      updateAssessmentLogDto,
    );
  }

  async delete(id: string): Promise<AssessmentLogEntity | null> {
    return this.assessmentLogRepository.findOneAndSoftDelete(id);
  }
}

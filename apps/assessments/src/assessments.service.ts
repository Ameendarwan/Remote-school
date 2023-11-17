// assessment.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { AssessmentsEntity } from './repository/entities/assessment.entity';
import { AssessmentsRepository } from './repository/repositories/assessment.repository';

@Injectable()
export class AssessmentsService {
  constructor(private readonly assessmentRepository: AssessmentsRepository) {}

  async create(
    createAssessmentDto: CreateAssessmentDto,
  ): Promise<AssessmentsEntity> {
    const assessment = this.assessmentRepository.create(createAssessmentDto);
    return assessment;
  }

  async findOne(id: string): Promise<AssessmentsEntity | null> {
    return this.assessmentRepository.findOne({ _id: id });
  }

  async findAll(): Promise<AssessmentsEntity[]> {
    return this.assessmentRepository.findAll({});
  }

  async update(
    id: string,
    updateAssessmentDto: UpdateAssessmentDto,
  ): Promise<AssessmentsEntity | null> {
    return this.assessmentRepository.findByIdAndUpdate(id, updateAssessmentDto);
  }

  async delete(id: string): Promise<AssessmentsEntity | null> {
    return this.assessmentRepository.findOneAndSoftDelete(id);
  }
}

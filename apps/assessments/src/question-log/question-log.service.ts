// question-log.service.ts
import { Injectable } from '@nestjs/common';
import { CreateQuestionLogDto } from './dto/create-question-log.dto';
import { UpdateQuestionLogDto } from './dto/update-question-log.dto';
import { QuestionLogRepository } from './repository/repositories/question-log.repository';
import { QuestionLogEntity } from './repository/entities/question-log.entity';

@Injectable()
export class QuestionLogService {
  constructor(private readonly questionLogRepository: QuestionLogRepository) {}

  async create(
    createQuestionLogDto: CreateQuestionLogDto,
  ): Promise<QuestionLogEntity> {
    return this.questionLogRepository.create(createQuestionLogDto);
  }

  async findById(id: string): Promise<QuestionLogEntity | null> {
    return this.questionLogRepository.findOne({ _id: id });
  }

  async findAll(): Promise<QuestionLogEntity[]> {
    return this.questionLogRepository.findAll({});
  }

  async update(
    id: string,
    updateQuestionLogDto: UpdateQuestionLogDto,
  ): Promise<QuestionLogEntity | null> {
    return this.questionLogRepository.findByIdAndUpdate(
      id,
      updateQuestionLogDto,
    );
  }

  async delete(id: string): Promise<QuestionLogEntity | null> {
    return this.questionLogRepository.findOneAndSoftDelete(id);
  }
}

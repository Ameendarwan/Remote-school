// questions.service.ts
import { Injectable } from '@nestjs/common';
import { QuestionsRepository } from './repository/repositories/questions.repository';
import { CreateQuestionsDto } from './dto/create-question.dto';
import { QuestionsEntity } from './repository/entities/question.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async create(
    createQuestionsDto: CreateQuestionsDto,
  ): Promise<QuestionsEntity> {
    return this.questionsRepository.create(createQuestionsDto);
  }

  async findById(id: string): Promise<QuestionsEntity | null> {
    return this.questionsRepository.findOne({ _id: id });
  }

  async findAll(): Promise<QuestionsEntity[]> {
    return this.questionsRepository.findAll({});
  }

  async update(
    id: string,
    updateQuestionsDto: UpdateQuestionDto,
  ): Promise<QuestionsEntity | null> {
    return this.questionsRepository.findByIdAndUpdate(id, updateQuestionsDto);
  }

  async delete(id: string): Promise<QuestionsEntity | null> {
    return this.questionsRepository.findOneAndSoftDelete(id);
  }
}

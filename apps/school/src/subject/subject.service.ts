import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from './../../../../libs/common/src/database/interfaces/database.interface';
import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectDoc } from './repository/entities/subject.entity';
import { SubjectRepository } from './repository/repositories/subject.repository';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectDoc> {
    const subject = this.subjectRepository.create({
      ...createSubjectDto,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });
    return subject;
  }

  async findById(id: string): Promise<SubjectDoc | null> {
    return this.subjectRepository.findOne({ _id: id });
  }

  async findAll(): Promise<SubjectDoc[]> {
    return this.subjectRepository.findAll({});
  }

  async update(
    subject: SubjectDoc,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectDoc | null> {
    try {
      if (updateSubjectDto.details) {
        updateSubjectDto.details = {
          ...subject.details,
          ...updateSubjectDto.details,
        };
      }

      return this.subjectRepository.findByIdAndUpdate(
        subject._id,
        updateSubjectDto,
      );
    } catch (error) {
      throw new Error(`Failed to update subject: ${error.message}`);
    }
  }

  async delete(id: string): Promise<SubjectDoc | null> {
    return this.subjectRepository.findOneAndSoftDelete(id);
  }

  async softDelete(id: string): Promise<SubjectDoc | null> {
    return this.subjectRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.subjectRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.subjectRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.subjectRepository.softDeleteMany(find, options);
  }
}

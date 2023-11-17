// class_subjects.service.ts
import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from '@app/common/database/interfaces/database.interface';
import { Injectable } from '@nestjs/common';
import { ClassesDoc } from '../classes/repository/entities/class.entity';
import { CreateClassSubjectsDto } from './dto/create-class-subject.dto';
import { UpdateClassSubjectDto } from './dto/update-class-subject.dto';
import { ClassSubjectsDoc } from './repository/entities/class-subject.entity';
import { ClassSubjectsRepository } from './repository/repositories/class-subjects.repository';
@Injectable()
export class ClassSubjectsService {
  constructor(
    private readonly classSubjectsRepository: ClassSubjectsRepository,
  ) {}

  async create(
    createClassSubjectsDto: CreateClassSubjectsDto,
  ): Promise<ClassSubjectsDoc> {
    const classSubjects = this.classSubjectsRepository.create({
      ...createClassSubjectsDto,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });
    return classSubjects;
  }

  async findById(id: string): Promise<ClassSubjectsDoc | null> {
    return this.classSubjectsRepository.findOne({ _id: id });
  }

  async findAll(): Promise<ClassSubjectsDoc[]> {
    return this.classSubjectsRepository.findAll({});
  }

  async update(
    classSubjects: ClassSubjectsDoc,
    updateClassSubjectsDto: UpdateClassSubjectDto,
  ): Promise<ClassSubjectsDoc | null> {
    try {
      if (updateClassSubjectsDto.details) {
        updateClassSubjectsDto.details = {
          ...classSubjects.details,
          ...updateClassSubjectsDto.details,
        };
      }

      return this.classSubjectsRepository.findByIdAndUpdate(
        classSubjects._id,
        updateClassSubjectsDto,
      );
    } catch (error) {
      throw new Error(`Failed to update classSubjects: ${error.message}`);
    }
  }

  async delete(id: string): Promise<ClassesDoc | null> {
    return this.classSubjectsRepository.findOneAndSoftDelete(id);
  }

  async softDelete(id: string): Promise<ClassesDoc | null> {
    return this.classSubjectsRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.classSubjectsRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.classSubjectsRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.classSubjectsRepository.softDeleteMany(find, options);
  }
}

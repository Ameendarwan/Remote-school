// classes.service.ts
import { Injectable } from '@nestjs/common';
import { CreateClassesDto } from './dto/create-class.dto';
import { UpdateClassesDto } from './dto/update-class.dto';
import { ClassesDoc } from './repository/entities/class.entity';
import { ClassesRepository } from './repository/repositories/classes.repository';
import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from '@app/common/database/interfaces/database.interface';

@Injectable()
export class ClassesService {
  constructor(private readonly classesRepository: ClassesRepository) {}

  async create(createClassesDto: CreateClassesDto): Promise<ClassesDoc> {
    const classes = this.classesRepository.create({
      ...createClassesDto,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });
    return classes;
  }

  async findById(id: string): Promise<ClassesDoc | null> {
    return this.classesRepository.findOne({ _id: id });
  }

  async findByGradeId(
    gradeId: string,
  ): Promise<{ data: ClassesDoc[]; total: number }> {
    const classes = await this.classesRepository.findAll({ gradeId });

    return { data: classes, total: classes.length };
  }

  async findAll(): Promise<ClassesDoc[]> {
    return this.classesRepository.findAll({});
  }

  async update(
    classes: ClassesDoc,
    updateClassesDto: UpdateClassesDto,
  ): Promise<ClassesDoc | null> {
    try {
      if (updateClassesDto.details) {
        updateClassesDto.details = {
          ...classes.details,
          ...updateClassesDto.details,
        };
      }

      return this.classesRepository.findByIdAndUpdate(
        classes._id,
        updateClassesDto,
      );
    } catch (error) {
      throw new Error(`Failed to update classes: ${error.message}`);
    }
  }

  async delete(id: string): Promise<ClassesDoc | null> {
    return this.classesRepository.findOneAndSoftDelete(id);
  }

  async softDelete(id: string): Promise<ClassesDoc | null> {
    return this.classesRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.classesRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.classesRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.classesRepository.softDeleteMany(find, options);
  }
}

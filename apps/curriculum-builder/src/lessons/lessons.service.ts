// lessons.service.ts
import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from '@app/common/database/interfaces/database.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from 'apps/auth/src/users/constants/user.status-code.constant';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonDoc } from './repository/entities/lesson.entity';
import { LessonsRepository } from './repository/repositories/lessons.repository';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async create(createLessonsDto: CreateLessonDto): Promise<LessonDoc> {
    const lesson = this.lessonsRepository.create(createLessonsDto);
    return lesson;
  }

  async findById(id: string): Promise<LessonDoc | null> {
    const lesson = await this.lessonsRepository.findOneById(id);
    if (!lesson) {
      //TODO - add lessons constact errors here
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'lesson.error.notFound',
      });
    }

    return lesson;
  }

  async findAll(): Promise<LessonDoc[]> {
    return this.lessonsRepository.findAll({});
  }

  findAllByChapter(chapterId: string) {
    return this.lessonsRepository.findAll({ chapterId });
  }

  async softDelete(id: string): Promise<LessonDoc | null> {
    return this.lessonsRepository.findOneAndSoftDelete(id);
  }

  async update(
    lesson: LessonDoc,
    updateLessonsDto: UpdateLessonDto,
  ): Promise<LessonDoc | null> {
    try {
      if (updateLessonsDto.details) {
        updateLessonsDto.details = {
          ...lesson.details,
          ...updateLessonsDto.details,
        };
      }

      return this.lessonsRepository.findByIdAndUpdate(
        lesson._id,
        updateLessonsDto,
      );
    } catch (error) {
      throw new Error(`Failed to update lessons: ${error.message}`);
    }
  }

  async delete(
    repository: LessonDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<LessonDoc> {
    return this.lessonsRepository.softDelete(repository, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.lessonsRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.lessonsRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.lessonsRepository.softDeleteMany(find, options);
  }
}

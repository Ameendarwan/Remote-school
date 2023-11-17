import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherDoc } from './repository/entities/teacher.entity';
import { TeacherRepository } from './repository/repositories/teacher.repository';

import {
  IDatabaseExistOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from '@app/common/database/interfaces/database.interface';

import { ENUM_TEACHER_STATUS_CODE_ERROR } from './constants/teacher.status-code.constant';
import { SignupTeacherDto } from './dto/signup-teacher.dto';
import { LinkTeacherDto } from './dto/teacher-link.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  async validateNewTeacher(userId: string) {
    //NOTE: this is useless as teacher won't be created single handedly - it will always be with new user/address
    const isUserAlreadyLinked = await this.teacherRepository.findOne({
      userId,
    });

    if (isUserAlreadyLinked) {
      throw new ConflictException({
        statusCode:
          ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_ALREADY_LINKED_WITH_USER_ID,
        message: 'teacher.error.alreadyLinkedWithUserId',
      });
    }
  }

  async create(createTeacherDto: SignupTeacherDto): Promise<TeacherDoc> {
    console.log(
      '🚀 ~ file: teacher.service.ts:43 ~ TeacherService ~ create ~ createTeacherDto:',
      createTeacherDto,
    );
    const teacher = this.teacherRepository.create({
      ...createTeacherDto,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });
    return teacher;
  }

  enroll(id: string, linkTeacherDto: LinkTeacherDto) {
    try {
      return this.teacherRepository.findByIdAndUpdate(id, linkTeacherDto);
    } catch (error) {
      throw new Error(`Failed to enroll teacher: ${error.message}`);
    }
  }

  async getTeacherByIdAndCheckIfExist(id: string): Promise<TeacherDoc | null> {
    const teacher = await this.findById(id);
    if (!teacher) {
      throw new NotFoundException({
        statusCode: ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_NOT_FOUND_ERROR,
        message: 'teacher.error.notFound',
      });
    }

    return teacher;
  }

  async findById(id: string): Promise<TeacherDoc | null> {
    return this.teacherRepository.findOneById(id, { join: true });
  }

  async fetchBySchoolId(schoolId: string): Promise<TeacherDoc | null> {
    return this.teacherRepository.findOneById(schoolId, { join: true });
  }

  async existByCnic(
    cnic: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.teacherRepository.exists(
      { cnic },
      { ...options, withDeleted: true },
    );
  }

  async findAll(): Promise<TeacherDoc[]> {
    return this.teacherRepository.findAll({}, { join: true });
  }

  async update(
    teacher: TeacherDoc,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherDoc | null> {
    try {
      // const TEACHER_DETAIL = 'teacherDetails';
      // const TEACHER_EDUCATION_DETAIL = 'education';

      if (updateTeacherDto.education) {
        updateTeacherDto.education = {
          ...teacher.education,
          ...updateTeacherDto.education,
        };
      }

      if (updateTeacherDto.teacherDetails) {
        updateTeacherDto.teacherDetails = {
          ...teacher.teacherDetails,
          ...updateTeacherDto.teacherDetails,
        };
      }

      // for (const key in updateTeacherDto) {
      //   if (key === TEACHER_DETAIL || key === TEACHER_EDUCATION_DETAIL)
      //     continue;
      //   teacher[key] = updateTeacherDto[key];
      // }

      return this.teacherRepository.findByIdAndUpdate(
        teacher._id,
        updateTeacherDto,
      );
    } catch (error) {
      throw new Error(`Failed to update teacher: ${error.message}`);
    }
  }

  async delete(
    repository: TeacherDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<TeacherDoc> {
    return this.teacherRepository.softDelete(repository, options);
  }

  async softDelete(id: string): Promise<TeacherDoc | null> {
    return this.teacherRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.teacherRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.teacherRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.teacherRepository.softDeleteMany(find, options);
  }
}

// curriculum.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CurriculumBuilderDoc } from './repository/entities/curriculum-builder.entity';
import { CurriculumBuilderRepository } from './repository/repositories/curriculum-builder.repository';
import { CreateCurriculumBuilderDto } from './dto/create-curriculum-builder.dto';
import { UpdateCurriculumBuilderDto } from './dto/update-curriculum-builder.dto';
import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from '@app/common/database/interfaces/database.interface';
import { ENUM_CURRICULUM_STATUS_CODE_ERROR } from './constants/curriculum.status-code.constant';
@Injectable()
export class CurriculumBuilderService {
  constructor(
    private readonly curriculumRepository: CurriculumBuilderRepository,
  ) {}

  async create(
    createCurriculumBuilderDto: CreateCurriculumBuilderDto,
  ): Promise<CurriculumBuilderDoc> {
    const isCurriculumAlreadyLinked = await this.curriculumRepository.findOne({
      subjectId: createCurriculumBuilderDto.subjectId,
    });

    if (isCurriculumAlreadyLinked) {
      throw new ConflictException({
        statusCode:
          ENUM_CURRICULUM_STATUS_CODE_ERROR.CURRICULUM_ALREADY_LINKED_WITH_SUBJECT_ID,
        message: 'teacher.error.alreadyLinkedWithSubjectId',
      });
    }
    const curriculum = this.curriculumRepository.create(
      createCurriculumBuilderDto,
    );
    return curriculum;
  }

  async findById(id: string): Promise<CurriculumBuilderDoc | null> {
    return this.curriculumRepository.findOne({ _id: id });
  }

  async findAll(): Promise<CurriculumBuilderDoc[]> {
    return this.curriculumRepository.findAll({});
  }

  async update(
    id: string,
    updateCurriculumDto: UpdateCurriculumBuilderDto,
  ): Promise<CurriculumBuilderDoc | null> {
    const curriculum = await this.findById(id);
    if (!curriculum) {
      throw new NotFoundException({
        statusCode:
          ENUM_CURRICULUM_STATUS_CODE_ERROR.CURRICULUM_NOT_FOUND_ERROR,
        message: 'curriculum.error.notFound',
      });
    }

    const curriculumInObject = { ...curriculum.toObject() };

    updateCurriculumDto.details = {
      ...curriculumInObject.details,
      ...updateCurriculumDto.details,
    };

    return this.curriculumRepository.findByIdAndUpdate(id, updateCurriculumDto);
  }

  async delete(id: string): Promise<CurriculumBuilderDoc | null> {
    return this.curriculumRepository.findOneAndSoftDelete(id);
  }

  async softDelete(id: string): Promise<CurriculumBuilderDoc | null> {
    return this.curriculumRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.curriculumRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.curriculumRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.curriculumRepository.softDeleteMany(find, options);
  }
}

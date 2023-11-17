import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeRepository } from './repository/repositories/grade.repository';
import { GradeDoc } from './repository/entities/grade.entity';
import { ClassesService } from '../classes/classes.service';
import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from '@app/common/database/interfaces/database.interface';

@Injectable()
export class GradeService {
  constructor(
    private readonly gradeRepository: GradeRepository,
    private classService: ClassesService,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<GradeDoc> {
    const grade = this.gradeRepository.create({
      ...createGradeDto,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });

    return grade;
  }

  async findById(id: string): Promise<GradeDoc | null> {
    return this.gradeRepository.findOne({ _id: id });
  }

  async findAll(): Promise<GradeDoc[]> {
    return this.gradeRepository.findAll({});
  }

  async findAllWithClasses() {
    const grades = await this.gradeRepository.findAll({});

    const gradesWithClasses = await Promise.all(
      grades.map(async (grade) => {
        const classes = await this.classService.findByGradeId(grade._id);

        return {
          ...grade,
          classes: classes.data,
          totalClasses: classes.total,
        };
      }),
    );

    return gradesWithClasses;
  }

  async update(
    grade: GradeDoc,
    updateGradeDto: UpdateGradeDto,
  ): Promise<GradeDoc | null> {
    try {
      if (updateGradeDto.details) {
        updateGradeDto.details = {
          ...grade.details,
          ...updateGradeDto.details,
        };
      }

      return this.gradeRepository.findByIdAndUpdate(grade._id, updateGradeDto);
    } catch (error) {
      throw new Error(`Failed to update grade: ${error.message}`);
    }
  }

  async delete(id: string): Promise<GradeDoc | null> {
    return this.gradeRepository.findOneAndSoftDelete(id);
  }

  async softDelete(id: string): Promise<GradeDoc | null> {
    return this.gradeRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.gradeRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.gradeRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.gradeRepository.softDeleteMany(find, options);
  }
}

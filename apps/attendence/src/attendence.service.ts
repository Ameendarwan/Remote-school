import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from '@app/common/database/interfaces/database.interface';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeacherDoc } from 'apps/auth/src/teacher/repository/entities/teacher.entity';
import { ENUM_ATTENDENCE_STATUS_CODE_ERROR } from './constants/attendence.status-code.constant';
import { CreateAttendenceDto } from './dto/create-attendance.dto';
import { MarkAttendanceDto } from './dto/mark-attendence.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendenceDoc } from './repository/entities/attendence.entity';
import { AttendenceRepository } from './repository/repositories/attendance.repository';

@Injectable()
export class AttendenceService {
  constructor(private readonly attendanceRepository: AttendenceRepository) {}

  async create(
    createAttendanceDto: CreateAttendenceDto,
  ): Promise<AttendenceDoc> {
    const todayDate = new Date();

    const existingAttendence = await this.attendanceRepository.findOne({
      classId: createAttendanceDto.classId,
      subjectId: createAttendanceDto.subjectId,
      userId: createAttendanceDto.userId,
      attendanceDate: {
        $gte: new Date(todayDate.toDateString()), // Start of the day
        $lt: new Date(new Date(todayDate.toDateString()).valueOf() + 86400000), // End of the day
      },
    });

    if (existingAttendence) {
      throw new ConflictException({
        statusCode: ENUM_ATTENDENCE_STATUS_CODE_ERROR.ATTENDENCE_ID_EXIST_ERROR,
        message: 'attendence.error.alreadyExistWithId',
      });
    }

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      attendanceDate: new Date(),
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });
    return attendance;
  }

  async markAttendence(markAttendanceDto: MarkAttendanceDto) {
    try {
      const { studentAttendances, ...restOfFields } = markAttendanceDto;

      const createPromises = studentAttendances.map(async (attendance) => {
        const createAttendanceDto = {
          ...restOfFields,
          userId: attendance.studentId,
          present: attendance.present,
        };

        await this.create(createAttendanceDto);
      });

      await Promise.all(createPromises);

      return 'Attendance marked.';
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<AttendenceDoc | null> {
    return this.attendanceRepository.findOneById(id);
  }

  async findAll(): Promise<AttendenceDoc[]> {
    return this.attendanceRepository.findAll({});
  }

  async update(
    id: string,
    updateAttendenceDto: UpdateAttendanceDto,
  ): Promise<AttendenceDoc | null> {
    const attendence = await this.findById(id);
    if (!attendence) {
      throw new NotFoundException({
        statusCode:
          ENUM_ATTENDENCE_STATUS_CODE_ERROR.ATTENDENCE_NOT_FOUND_ERROR,
        message: 'attendence.error.notFound',
      });
    }

    const attendenceInObject = { ...attendence.toObject() };

    updateAttendenceDto.details = {
      ...attendenceInObject.details,
      ...updateAttendenceDto.details,
    };

    return this.attendanceRepository.findByIdAndUpdate(id, updateAttendenceDto);
  }

  async delete(id: string): Promise<AttendenceDoc | null> {
    return this.attendanceRepository.findOneAndSoftDelete(id);
  }

  async softDelete(id: string): Promise<TeacherDoc | null> {
    return this.attendanceRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.attendanceRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.attendanceRepository.deleteMany(find, options);
  }
}

import {
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from '@app/common/database/interfaces/database.interface';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../users/constants/user.status-code.constant';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentDoc } from './repository/entities/student.entity';
import { StudentRepository } from './repository/repositories/student.repository';

import { HelperServicesService } from '@app/common/helper/services/helper.services.service';
import { AddressService } from '@app/common/modules/address/address.service';
import { CreateAddressDto } from '@app/common/modules/address/dto/create-address.dto';
import { CreateUserDto, UserRole } from '../users/dto/create-user.dto';
import { UserService } from '../users/users.service';
import { ENUM_STUDENT_STATUS_CODE_ERROR } from './constants/student.status-code.constant';
import { RegisterStudentDto } from './dto/register-student.dto';
import { SignupStudentDto } from './dto/signup-student.dto';
import { LinkStudentDto } from './dto/student-link.dto';

@Injectable()
export class StudentService {
  constructor(
    private readonly helperServicesService: HelperServicesService,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly studentRepository: StudentRepository,
  ) {}

  // async validateNewStudent(userId: string) {
  //   //NOTE: this is useless as teacher won't be created single handedly - it will always be with new user/address
  //   const isUserAlreadyLinked = await this.studentRepository.findOne({
  //     userId,
  //   });

  async validateNewStudent(userId: string) {
    //NOTE: this is useless as teacher won't be created single handedly - it will always be with new user/address
    const isUserAlreadyLinked = await this.studentRepository.findOne({
      userId,
    });

    if (isUserAlreadyLinked) {
      throw new ConflictException({
        statusCode:
          ENUM_STUDENT_STATUS_CODE_ERROR.STUDENT_ALREADY_LINKED_WITH_USER_ID,
        message: 'student.error.alreadyLinkedWithUserId',
      });
    }
  }

  async singup(registerStudentDto: RegisterStudentDto): Promise<StudentDoc> {
    const userDto = new CreateUserDto();
    const studentDto = new CreateStudentDto();
    const addressDto = new CreateAddressDto(true);

    //REVIEW - Had to assign intial values to each DTO to acheive seperation - try to find better way to extract fields

    const extractedUserData = this.helperServicesService.extractFields(
      registerStudentDto,
      userDto,
    );

    const extractedStudentData = this.helperServicesService.extractFields(
      registerStudentDto,
      studentDto,
    );

    const extractedAddressData = this.helperServicesService.extractFields(
      registerStudentDto,
      addressDto,
    );

    const { username, email } = extractedUserData;

    if (!username && !email) {
      throw new BadRequestException({
        statusCode:
          ENUM_USER_STATUS_CODE_ERROR.USER_MISSING_USERNAME_EMAIL_ERROR,
        message: 'user.error.missingUsernameEmail',
      });
    }

    const promises: Promise<any>[] = [];

    if (username) {
      promises.push(this.userService.existByUsername(username));
    }

    if (email) {
      promises.push(this.userService.existByEmail(email));
    }

    const [usernameExist, emailExist] = await Promise.all(promises);
    console.log(
      '🚀 ~ file: student.service.ts:91 ~ StudentService ~ singup ~ usernameExist:',
      usernameExist,
    );

    if (usernameExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
        message: 'user.error.usernameExist',
      });
    }

    if (emailExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        message: 'user.error.emailExist',
      });
    }

    const address = await this.addressService.create(extractedAddressData);
    console.log(
      '🚀 ~ file: student.controller.ts:110 ~ StudentController ~ register ~ address:',
      address,
    );

    const user = await this.userService.create({
      ...extractedUserData,
      role: UserRole.Student,
      addressId: address._id,
    });
    console.log(
      '🚀 ~ file: student.controller.ts:117 ~ StudentController ~ register ~ user:',
      user,
    );

    const student = await this.create({
      ...extractedStudentData,
      userId: user._id,
    });

    const result = {
      ...student.toObject(),
      user: user.toObject(),
      address: address.toObject(),
    };

    return result;
  }

  async create(createStudentDto: SignupStudentDto): Promise<StudentDoc> {
    const student = this.studentRepository.create({
      ...createStudentDto,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });
    return student;
  }

  async findById(id: string): Promise<StudentDoc | null> {
    return this.studentRepository.findOneById(id, { join: true });
  }

  async findAll(): Promise<StudentDoc[]> {
    return this.studentRepository.findAll({}, { join: true });
  }

  async fetchStudentBySchoolAndClass(
    linkStudentDto: LinkStudentDto,
  ): Promise<StudentDoc[]> {
    const { schoolId, gradeId, classId } = linkStudentDto;
    return this.studentRepository.findAll(
      { schoolId, gradeId, classId },
      { join: true },
    );
  }

  enroll(id: string, linkStudentDto: LinkStudentDto) {
    try {
      return this.studentRepository.findByIdAndUpdate(id, linkStudentDto);
    } catch (error) {
      throw new Error(`Failed to enroll student: ${error.message}`);
    }
  }

  async fetchBySchoolId(schoolId: string): Promise<StudentDoc | null> {
    return this.studentRepository.findOneById(schoolId, { join: true });
  }

  async fetchByClassId(classId: string): Promise<StudentDoc | null> {
    return this.studentRepository.findOneById(classId, { join: true });
  }

  async getStudentByIdAndCheckIfExist(id: string): Promise<StudentDoc | null> {
    const student = await this.findById(id);
    if (!student) {
      throw new NotFoundException({
        statusCode: ENUM_STUDENT_STATUS_CODE_ERROR.STUDENT_NOT_FOUND_ERROR,
        message: 'student.error.notFound',
      });
    }

    return student;
  }

  async update(
    student: StudentDoc,

    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDoc | null> {
    try {
      if (updateStudentDto.studentDetails) {
        updateStudentDto.studentDetails = {
          ...student.studentDetails,
          ...updateStudentDto.studentDetails,
        };
      }

      // for (const key in updateStudentDto) {
      //   if (key === STUDENT_DETAIL) continue;
      //   student[key] = updateStudentDto[key];
      // }

      return await this.studentRepository.findByIdAndUpdate(
        student._id,
        updateStudentDto,
      );
    } catch (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }
    try {
      if (updateStudentDto.studentDetails) {
        updateStudentDto.studentDetails = {
          ...student.studentDetails,
          ...updateStudentDto.studentDetails,
        };
      }

      // for (const key in updateStudentDto) {
      //   if (key === STUDENT_DETAIL) continue;
      //   student[key] = updateStudentDto[key];
      // }

      return await this.studentRepository.findByIdAndUpdate(
        student._id,
        updateStudentDto,
      );
    } catch (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }
  }

  async delete(
    repository: StudentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StudentDoc> {
    return this.studentRepository.softDelete(repository, options);
  }

  async softDelete(id: string): Promise<StudentDoc | null> {
    return this.studentRepository.findOneAndSoftDelete(id);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.studentRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.studentRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.studentRepository.softDeleteMany(find, options);
  }
}

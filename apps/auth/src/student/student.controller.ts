import { HelperServicesService } from '@app/common/helper/services/helper.services.service';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressService } from '../../../../libs/common/src/modules/address/address.service';
import { ENUM_ADDRESS_STATUS_CODE_ERROR } from '../../../../libs/common/src/modules/address/constants/address.status-code.constant';
import { UpdateAddressDto } from '../../../../libs/common/src/modules/address/dto/update-address.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from '../users/constants/user.status-code.constant';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserService } from '../users/users.service';
import { ENUM_STUDENT_STATUS_CODE_ERROR } from './constants/student.status-code.constant';
import { RegisterStudentDto } from './dto/register-student.dto';
import { LinkStudentDto } from './dto/student-link.dto';
import { UpdateRegisterStudentDto } from './dto/update-register-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly helperServicesService: HelperServicesService,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  @Post('sign-up')
  async register(@Body() registerStudentDto: RegisterStudentDto) {
    return this.studentService.singup(registerStudentDto);
  }

  @Get('by-school/:schoolId')
  fetchBySchoolId(@Param('schoolId') schoolId: string) {
    return this.studentService.fetchBySchoolId(schoolId);
  }

  @Get('by-class/:classId')
  fetchByClassId(@Param('classId') classId: string) {
    return this.studentService.fetchByClassId(classId);
  }

  @Post('enroll-student/:studentId')
  create(
    @Param('studentId') id: string,
    @Body() linkStudentDto: LinkStudentDto,
  ) {
    return this.studentService.enroll(id, linkStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Post('fetch-enrolled-student')
  fetchStudentBySchoolAndClass(@Body() linkStudentDto: LinkStudentDto) {
    return this.studentService.fetchStudentBySchoolAndClass(linkStudentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateRegisterStudentDto,
  ) {
    try {
      const student =
        await this.studentService.getStudentByIdAndCheckIfExist(id);

      const user = await this.userService.getUserByIdAndCheckIfExist(
        student.userId,
      );

      const address = await this.addressService.findById(user.addressId);

      const userDto = new UpdateUserDto();
      const teacherDto = new UpdateStudentDto();
      const addressDto = new UpdateAddressDto(true);

      const extractedUserData = this.helperServicesService.extractFields(
        updateStudentDto,
        userDto,
      );

      const extractedStudentData = this.helperServicesService.extractFields(
        updateStudentDto,
        teacherDto,
      );

      const extractedAddressData = this.helperServicesService.extractFields(
        updateStudentDto,
        addressDto,
      );

      const { username, email } = extractedUserData;
      const { latitude, longitude } = extractedAddressData;

      const promises: Promise<any>[] = [
        this.addressService.existsByLatitudeAndLongtitude({
          latitude,
          longitude,
        }),
        this.userService.existByUsername(username),
        this.userService.existByEmail(email),
      ];

      const [addressExist, usernameExist, emailExist] =
        await Promise.all(promises);

      if (addressExist) {
        if (address.longitude !== longitude && address.latitude !== latitude)
          throw new ConflictException({
            statusCode: ENUM_ADDRESS_STATUS_CODE_ERROR.ADDRESS_EXISTS_ERROR,
            message: 'address.error.addressAlreadyExist',
          });
      }

      if (usernameExist) {
        if (user.username !== username)
          throw new ConflictException({
            statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
            message: 'user.error.usernameExist',
          });
      }

      if (emailExist) {
        if (user.email !== email) {
          throw new ConflictException({
            statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
            message: 'user.error.emailExist',
          });
        }
      }

      const updatedStudent = await this.studentService.update(
        student,
        extractedStudentData,
      );

      const updatedUser = await this.userService.update(
        user,
        extractedUserData,
      );

      const updatedAddress = await this.addressService.update(
        user.addressId,
        extractedAddressData,
      );

      const result = {
        ...updatedStudent,
        user: updatedUser,
        address: updatedAddress,
      };

      return result;
    } catch (error) {
      throw new NotFoundException({
        statusCode: ENUM_STUDENT_STATUS_CODE_ERROR.STUDENT_NOT_FOUND_ERROR,
        message: error.message || 'data.error.unknown',
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.softDelete(id);
  }
}

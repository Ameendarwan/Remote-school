import { HelperServicesService } from '@app/common/helper/services/helper.services.service';
import {
  BadRequestException,
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
import { CreateAddressDto } from '../../../../libs/common/src/modules/address/dto/create-address.dto';
import { UpdateAddressDto } from '../../../../libs/common/src/modules/address/dto/update-address.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from '../users/constants/user.status-code.constant';
import { CreateUserDto, UserRole } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserService } from '../users/users.service';
import { ENUM_TEACHER_STATUS_CODE_ERROR } from './constants/teacher.status-code.constant';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LinkTeacherDto } from './dto/teacher-link.dto';
import { UpdateRegisterTeacherDto } from './dto/update-register-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly helperServicesService: HelperServicesService,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  @Post('sign-up')
  async register(@Body() registerTeacherDto: RegisterTeacherDto) {
    const userDto = new CreateUserDto();
    const teacherDto = new CreateTeacherDto();
    const addressDto = new CreateAddressDto(true);

    const extractedUserData = this.helperServicesService.extractFields(
      registerTeacherDto,
      userDto,
    );

    const extractedTeacherData = this.helperServicesService.extractFields(
      registerTeacherDto,
      teacherDto,
    );

    const extractedAddressData = this.helperServicesService.extractFields(
      registerTeacherDto,
      addressDto,
    );

    const { username, email } = extractedUserData;
    const { cnic } = extractedTeacherData;

    if (!username && !email) {
      throw new BadRequestException({
        statusCode:
          ENUM_USER_STATUS_CODE_ERROR.USER_MISSING_USERNAME_EMAIL_ERROR,
        message: 'user.error.missingUsernameEmail',
      });
    }

    const promises: Promise<any>[] = [
      this.teacherService.existByCnic(cnic),
      this.addressService.existsByLatitudeAndLongtitude(extractedAddressData),
      this.userService.existByUsername(username),
      this.userService.existByEmail(email),
    ];

    const [teacherExist, addressExist, usernameExist, emailExist] =
      await Promise.all(promises);

    if (teacherExist) {
      throw new ConflictException({
        statusCode: ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_CNIC_EXIST_ERROR,
        message: 'teacher.error.cnicExists',
      });
    }

    if (addressExist) {
      throw new ConflictException({
        statusCode: ENUM_ADDRESS_STATUS_CODE_ERROR.ADDRESS_EXISTS_ERROR,
        message: 'address.error.addressAlreadyExist',
      });
    }

    if (usernameExist) {
      const usernameExist: boolean =
        await this.userService.existByUsername(username);
      if (usernameExist) {
        throw new ConflictException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
          message: 'user.error.usernameExist',
        });
      }
    }

    if (emailExist) {
      const emailExist: boolean = await this.userService.existByEmail(email);
      if (emailExist) {
        throw new ConflictException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
          message: 'user.error.emailExist',
        });
      }
    }

    const address = await this.addressService.create(extractedAddressData);

    const user = await this.userService.create({
      ...extractedUserData,
      role: UserRole.Teacher,
      addressId: address._id,
    });

    const teacher = await this.teacherService.create({
      ...extractedTeacherData,
      userId: user._id,
    });

    const result = {
      ...teacher.toObject(),
      user: user.toObject(),
      address: address.toObject(),
    };

    return result;
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findById(id);
  }

  @Get('by-school/:schoolId')
  fetchBySchoolId(@Param('schoolId') schoolId: string) {
    return this.teacherService.fetchBySchoolId(schoolId);
  }

  @Post('enroll-to-school/:id')
  enrollToSchool(
    @Param('id') id: string,
    @Body() linkTeacherDto: LinkTeacherDto,
  ) {
    return this.teacherService.enroll(id, linkTeacherDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateRegisterTeacherDto,
  ) {
    try {
      const teacher =
        await this.teacherService.getTeacherByIdAndCheckIfExist(id);

      const user = await this.userService.getUserByIdAndCheckIfExist(
        teacher.userId,
      );

      const address = await this.addressService.findById(user.addressId);

      const userDto = new UpdateUserDto();
      const teacherDto = new UpdateTeacherDto();
      const addressDto = new UpdateAddressDto();

      const extractedUserData = this.helperServicesService.extractFields(
        updateTeacherDto,
        userDto,
      ) as CreateUserDto;

      const extractedTeacherData = this.helperServicesService.extractFields(
        updateTeacherDto,
        teacherDto,
      ) as CreateTeacherDto;

      const extractedAddressData = this.helperServicesService.extractFields(
        updateTeacherDto,
        addressDto,
      ) as CreateAddressDto;

      const { username, email } = extractedUserData;
      const { cnic } = extractedTeacherData;
      const { latitude, longitude } = extractedAddressData;

      const promises: Promise<any>[] = [
        this.teacherService.existByCnic(cnic),
        this.addressService.existsByLatitudeAndLongtitude({
          latitude,
          longitude,
        }),
        this.userService.existByUsername(username),
        this.userService.existByEmail(email),
      ];

      const [teacherExist, addressExist, usernameExist, emailExist] =
        await Promise.all(promises);

      if (teacherExist) {
        if (teacher.cnic !== cnic)
          throw new ConflictException({
            statusCode: ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_CNIC_EXIST_ERROR,
            message: 'teacher.error.cnicExists',
          });
      }

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

      const updatedTeacher = await this.teacherService.update(
        teacher,
        extractedTeacherData,
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
        ...updatedTeacher,
        user: updatedUser,
        address: updatedAddress,
      };

      return result;
    } catch (error) {
      throw new NotFoundException({
        statusCode: ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_NOT_FOUND_ERROR,
        message: error.message || 'data.error.unknown',
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.softDelete(id);
  }
}

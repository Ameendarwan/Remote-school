import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  GetUser,
} from '../../../../libs/common/src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';

import { IAuthPassword } from '@app/common/auth/interfaces/auth.interface';
import { AuthenticationService } from '@app/common/auth/services/auth.service';
import { UserDoc } from '../../../../libs/common/src/entities/auth/user.entity';
import { ENUM_USER_STATUS_CODE_ERROR } from './constants/user.status-code.constant';
import { UserChangePasswordDto } from './dto/user.change-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthenticationService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDoc) {
    return user;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const { username, email } = updateUserDto;

    const promises: Promise<any>[] = [
      this.userService.existByUsername(username),
      this.userService.existByEmail(email),
    ];

    const [usernameExist, emailExist] = await Promise.all(promises);

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

    const user = await this.userService.getUserByIdAndCheckIfExist(id);

    return this.userService.update(user, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }

  @Patch('/change-password')
  async changePassword(
    @Body() body: UserChangePasswordDto,
    @GetUser() user: UserDoc,
  ): Promise<void> {
    const matchPassword: boolean = await this.authService.validateUser(
      body.oldPassword,
      user.password,
    );
    if (!matchPassword) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
        message: 'user.error.passwordNotMatch',
      });
    }

    const newMatchPassword: boolean = await this.authService.validateUser(
      body.newPassword,
      user.password,
    );
    if (newMatchPassword) {
      throw new BadRequestException({
        statusCode:
          ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
        message: 'user.error.newPasswordMustDifference',
      });
    }

    const password: IAuthPassword = await this.authService.createPassword(
      body.newPassword,
    );

    await this.userService.updatePassword(user, password);

    return;
  }
}

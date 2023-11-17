import { IAuthPassword } from '@app/common/auth/interfaces/auth.interface';
import { AuthenticationService } from '@app/common/auth/services/auth.service';
import {
  IDatabaseExistOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from '@app/common/database/interfaces/database.interface';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserDoc } from '../../../../libs/common/src/entities/auth/user.entity';
import { ENUM_USER_STATUS_CODE_ERROR } from './constants/user.status-code.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignupUserDto } from './dto/user.sign-up.dto';
import { UserRepository } from './repository/repositories/user.repository';

type ValidateUserInput = {
  username?: string;
  email?: string;
} & ({ username: string } | { email: string });

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly userRepository: UserRepository,
  ) {}
  async verifyUser(usernameOrEmail: string, password: string) {
    if (!usernameOrEmail) {
      throw new BadRequestException({
        statusCode:
          ENUM_USER_STATUS_CODE_ERROR.USER_MISSING_USERNAME_EMAIL_ERROR,
        message: 'user.error.missingUsernameOrEmail',
      });
    }

    let user;

    const isEmail = usernameOrEmail.includes('@');

    if (!isEmail) {
      user = await this.findUserByUsername(usernameOrEmail);
    } else {
      user = await this.findUserByEmail(usernameOrEmail);
    }

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    const validate: boolean = await this.authService.validateUser(
      password,
      user.password,
    );

    if (!validate) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
        message: 'user.error.passwordNotMatch',
      });
    }

    return user;
  }

  async findOneByEmail<UserDoc>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc> {
    return this.userRepository.findOne<UserDoc>({ email }, options);
  }

  async findOneByUsername<UserDoc>(
    username: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc> {
    return this.userRepository.findOne<UserDoc>({ username }, options);
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email already exists.');
  }

  async findOneById(id: string): Promise<UserDoc | null> {
    return this.userRepository.findOneById(id);
  }

  async findAll(): Promise<UserDoc[]> {
    return this.userRepository.findAll({});
  }

  async validateNewUser(dto: ValidateUserInput) {
    await this.mustUsernameAndEmailValid(dto.username, dto.email);
  }

  async create({
    email,
    username,
    password,
    ...body
  }: SignupUserDto): Promise<UserDoc> {
    const encryption = await this.authService.createPassword(password);

    const userToCreate: Partial<UserDoc> = {
      password: encryption.passwordHash,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
      ...body,
    };

    if (username) {
      userToCreate.username = username;
    }

    if (email) {
      userToCreate.email = email;
    }

    return this.userRepository.create(userToCreate);
  }

  async getUserByIdAndCheckIfExist(id: string): Promise<UserDoc | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async update(
    user: UserDoc,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDoc | null> {
    try {
      if (updateUserDto.userDetails) {
        updateUserDto.userDetails = {
          ...user.userDetails,
          ...updateUserDto.userDetails,
        };
      }
      return this.userRepository.findByIdAndUpdate(user._id, updateUserDto);
    } catch (error) {
      throw new Error(`Failed to update address: ${error.message}`);
    }
  }

  // async update(
  //   id: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<UserDoc | null> {
  //   const userInObject = { ...user.toObject() };

  //   updateUserDto.userDetails = {
  //     ...userInObject.userDetails,
  //     ...updateUserDto.userDetails,
  //   };

  //   return this.userRepository.findByIdAndUpdate(id, updateUserDto);
  // }

  // async updatePassword(
  //   repository: UserDoc,
  //   { passwordHash, salt, passwordCreated }: IAuthPassword,
  //   options?: IDatabaseSaveOptions,
  // ): Promise<UserDoc> {
  //   repository.password = passwordHash;

  //   return this.userRepository.save(repository, options);
  //   try {
  //     if (updateUserDto.userDetails) {
  //       updateUserDto.userDetails = {
  //         ...user.userDetails,
  //         ...updateUserDto.userDetails,
  //       };
  //     }
  //     return this.userRepository.findByIdAndUpdate(user._id, updateUserDto);
  //   } catch (error) {
  //     throw new Error(`Failed to update address: ${error.message}`);
  //   }
  // }

  // async update(
  //   id: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<UserDoc | null> {
  //   const userInObject = { ...user.toObject() };

  //   updateUserDto.userDetails = {
  //     ...userInObject.userDetails,
  //     ...updateUserDto.userDetails,
  //   };

  //   return this.userRepository.findByIdAndUpdate(id, updateUserDto);
  // }

  async updatePassword(
    repository: UserDoc,
    { passwordHash }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.password = passwordHash;

    return this.userRepository.save(repository, options);
  }

  async delete(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    return this.userRepository.softDelete(repository, options);
  }

  async findById(id: string): Promise<UserDoc | null> {
    return this.userRepository.findOneById(id);
  }

  async softDelete(id: string): Promise<UserDoc | null> {
    return this.userRepository.findOneAndSoftDelete(id);
  }

  async getUser(getUserDto: GetUserDto) {
    return await this.userRepository.findOne(getUserDto);
  }

  // async deleteMany(
  //   find: Record<string, any>,
  //   options?: IDatabaseManyOptions,
  // ): Promise<boolean> {
  //   return this.userRepository.deleteMany(find, options);
  // }

  // async softDeleteMany(
  //   find: Record<string, any>,
  //   options?: IDatabaseManyOptions,
  // ): Promise<boolean> {
  //   return this.userRepository.softDeleteMany(find, options);
  // }

  // private mustUsernameAndEmailExists(username: string, email: string) {
  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.userRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.userRepository.softDeleteMany(find, options);
  }

  private mustUsernameAndEmailExists(username: string, email: string) {
    if (!username && !email) {
      throw new BadRequestException({
        statusCode:
          ENUM_USER_STATUS_CODE_ERROR.USER_MISSING_USERNAME_EMAIL_ERROR,
        message: 'user.error.missingUsernameEmail',
      });
    }
  }

  async mustUsernameAndEmailValid(username: string, email: string) {
    this.mustUsernameAndEmailExists(username, email);

    await this.isUsernameAndEmailValid(username, email);
  }

  private async isUsernameAndEmailValid(username: string, email: string) {
    if (username) {
      const usernameExist: boolean = await this.existByUsername(username);
      if (usernameExist) {
        throw new ConflictException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
          message: 'user.error.usernameExist',
        });
      }
    }

    if (email) {
      const emailExist: boolean = await this.existByEmail(email);
      if (emailExist) {
        throw new ConflictException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
          message: 'user.error.emailExist',
        });
      }
    }
  }

  async existByUsername(
    username: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      { username },
      { ...options, withDeleted: true },
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.userRepository.getTotal(find, options);
  }

  async existByEmail(
    email: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      {
        email: {
          $regex: new RegExp(`\\b${email}\\b`),
          $options: 'i',
        },
      },
      { ...options, withDeleted: true },
    );
  }

  async findUserByEmail(email: string) {
    const user = await this.findOneByEmail<UserDoc>(email);

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.findOneByUsername<UserDoc>(username);

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }
    return user;
    // }
  }
}

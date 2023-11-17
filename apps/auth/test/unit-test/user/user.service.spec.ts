import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import { killDatabaseConnection } from '../helpers/database.memory.module';
import { UserDoc, UserEntity, UserSchema } from '@app/common/entities/auth';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import configs from 'apps/auth/src/configs';
import { ConfigModule } from '@nestjs/config';
import { ENUM_USER_STATUS_CODE_ERROR } from 'apps/auth/src/users/constants/user.status-code.constant';
import { UpdateUserDto } from 'apps/auth/src/users/dto/update-user.dto';
import { UserRepository } from 'apps/auth/src/users/repository/repositories/user.repository';
import { UserRepositoryModule } from 'apps/auth/src/users/repository/user.repository.module';
import { UserService } from 'apps/auth/src/users/users.service';
import { fakerUserDto } from '../stubs/user.stub';
import { UserRole } from 'apps/auth/src/users/dto/create-user-no-role.dto';
import { AuthenticationModule } from '@app/common/auth/auth.module';
import { HelperModule } from '@app/common/helper/helper.module';
// export const userId = faker.string.uuid();
describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;
  let fakeUser: UserDoc;
  let userId: string;

  beforeAll(async () => {
    const moduleRefRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
          isGlobal: true,
          cache: true,
          envFilePath: ['.env'],
          expandVariables: true,
        }),
        // DatabaseTestMongooseModule,
        MongooseModule.forRootAsync({
          imports: [DatabaseOptionsModule],
          inject: [DatabaseOptionsService],
          useFactory: async (databaseOptionsService: DatabaseOptionsService) =>
            databaseOptionsService.createOptions(),
        }),
        MongooseModule.forFeature([
          {
            name: UserEntity.name,
            schema: UserSchema,
          },
        ]),
        UserRepositoryModule,
        AuthenticationModule,
        HelperModule,
      ],
      providers: [UserService],
    }).compile();

    service = moduleRefRef.get<UserService>(UserService);
    repository = moduleRefRef.get<UserRepository>(UserRepository);
    const addressId = faker.string.uuid();
    const role = faker.helpers.arrayElement([
      UserRole.Student,
      UserRole.Student,
    ]);
    fakeUser = await service.create({ ...fakerUserDto, role, addressId });
    userId = fakeUser._id;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all user', async () => {
      const findAllSpy = jest.spyOn(repository, 'findAll');

      const result = await service.findAll();

      expect(findAllSpy).toHaveBeenCalled();
      expect(result.length).toEqual(1);
    });
  });

  describe('findOne', () => {
    it('should find user by id', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOneById');

      const result = await service.findById(fakeUser._id);

      expect(findOneSpy).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith(fakeUser._id);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
        }),
      );
      expect(result._id).toBe(fakeUser._id);
    });

    it('should find user by email', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOne');

      const result = await service.findOneByEmail<UserDoc>(fakeUser.email);
      //TODO - maybe add scenarios with different testing for more robust testing
      const options = undefined;
      expect(findOneSpy).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith(
        { email: fakeUser.email },
        options,
      );

      expect(result.email).toBe(fakeUser.email);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
        }),
      );
    });
  });

  describe('getTotal', () => {
    it('should get total number of settings', async () => {
      const getTotalSpy = jest.spyOn(repository, 'getTotal');

      const result = await service.getTotal();

      expect(getTotalSpy).toHaveBeenCalled();
      expect(typeof result).toBe('number');
      expect(result).toBe(1);
    });
  });

  describe('create', () => {
    const addressId = faker.string.uuid();
    const role = faker.helpers.arrayElement([
      UserRole.Student,
      UserRole.Student,
    ]);

    it('should create new user', async () => {
      //NOTE - importing fake user from stub doesn't work as expected - I think maybe fakeAdress also using that so it won't be different in run-time
      const fakeUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        birthDate: faker.date.past(),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        imageUrl: faker.image.avatar(),
        email: faker.internet.email(),
        primaryPhone: faker.phone.number(),
        secondaryPhone: faker.phone.number(),
        userDetails: { instructions: faker.word.adjective() },
        role,
        addressId,
      };

      const createSpy = jest.spyOn(repository, 'create');

      const result = await service.create(fakeUserDto);

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        ...fakeUserDto,
        password: expect.any(String),
        updatedBy: expect.any(String),
        effectiveAt: expect.any(Date),
      });

      expect(result._id).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          password: expect.not.stringMatching(fakeUserDto.password),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
        }),
      );
    });

    describe('create duplication', () => {
      it('should not allow user with duplicate username', async () => {
        const findOneSpy = jest.spyOn(repository, 'findOne');

        const fakeUserDto = {
          username: fakeUser.username,
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          middleName: faker.person.middleName(),
          birthDate: faker.date.past(),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          imageUrl: faker.image.avatar(),
          email: faker.internet.email(),
          primaryPhone: faker.phone.number(),
          secondaryPhone: faker.phone.number(),
          userDetails: { instructions: faker.word.adjective() },
          role,
          addressId,
        };

        try {
          await service.create(fakeUserDto);
          fail('Expected ConflictException to be thrown');
        } catch (error) {
          expect(findOneSpy).toHaveBeenCalled();
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.response).toEqual({
            statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
            message: 'user.error.usernameExist',
          });
        }
      });

      it('should not allow user with duplicate email', async () => {
        const findOneSpy = jest.spyOn(repository, 'findOne');

        const fakeUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          middleName: faker.person.middleName(),
          birthDate: faker.date.past(),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          imageUrl: faker.image.avatar(),
          email: fakeUser.email,
          primaryPhone: faker.phone.number(),
          secondaryPhone: faker.phone.number(),
          userDetails: { instructions: faker.word.adjective() },
          role,
          addressId,
        };

        try {
          await service.create(fakeUserDto);
          fail('Expected ConflictException to be thrown');
        } catch (error) {
          expect(findOneSpy).toHaveBeenCalled();
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.response).toEqual({
            statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
            message: 'user.error.emailExist',
          });
        }
      });

      it('should not allow user it missing username & email', async () => {
        const findOneSpy = jest.spyOn(repository, 'findOne');

        const fakeUserDto = {
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          middleName: faker.person.middleName(),
          birthDate: faker.date.past(),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          imageUrl: faker.image.avatar(),
          primaryPhone: faker.phone.number(),
          secondaryPhone: faker.phone.number(),
          userDetails: { instructions: faker.word.adjective() },
          role,
          addressId,
        };

        try {
          await service.create(fakeUserDto);
          fail('Expected BadRequestException to be thrown');
        } catch (error) {
          expect(findOneSpy).toHaveBeenCalled();
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.response).toEqual({
            statusCode:
              ENUM_USER_STATUS_CODE_ERROR.USER_MISSING_USERNAME_EMAIL_ERROR,
            message: 'user.error.missingUsernameEmail',
          });
        }
      });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when ID is not found', async () => {
      const id = 'nonexistent-id';
      const updateUserDto: UpdateUserDto = {
        username: 'Troy',
      };

      try {
        await service.update(id, updateUserDto);
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('user.error.notFound');
        expect(error.response).toEqual({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
          message: 'user.error.notFound',
        });
      }
    });

    it('should not update user with duplicate username', async () => {
      const updateUserDto: UpdateUserDto = {
        username: fakeUser.username,
      };

      try {
        await service.update(fakeUser._id, updateUserDto);
        fail('Expected ConflictException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
          message: 'user.error.usernameExist',
        });
      }
    });

    it('should update userDetails object and retain old fields in it', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const oldFields = { ...fakeUser.userDetails };

      const userDetails = {
        weekendAreNotForWork: faker.lorem.sentence(),
      };

      const userId = fakeUser._id;
      const dto: UpdateUserDto = {
        userDetails,
      };

      const result = await service.update(userId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          userDetails: expect.objectContaining({
            // instructions: userDetails.instructions,
            ...userDetails,
            ...oldFields,
          }),
        }),
      );

      expect(result._id).toBe(userId);
    });

    it('should update existing fields in userDetails object', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const userId = fakeUser._id;
      const dto: UpdateUserDto = {
        userDetails: {
          instructions: faker.lorem.sentence(),
        },
      };

      const result = await service.update(userId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          userDetails: expect.any(Object),
        }),
      );
      expect(result._id).toBe(userId);
      expect(result.userDetails.instructions).toEqual(
        dto.userDetails.instructions,
      );
    });

    it('should update all fields of user entity at once', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const userId = fakeUser._id;

      const dto: UpdateUserDto = {
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        birthDate: faker.date.past(),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        imageUrl: faker.image.avatar(),
        email: faker.internet.email(),
        primaryPhone: faker.phone.number(),
        secondaryPhone: faker.phone.number(),
        userDetails: { instructions: faker.word.adjective() },
      };

      const result = await service.update(userId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(userId, dto);

      expect(result.username).toBe(dto.username);
      expect(result.firstName).toBe(dto.firstName.toLowerCase());
      expect(result.lastName).toBe(dto.lastName.toLowerCase());
      expect(result.middleName).toBe(dto.middleName.toLowerCase());
      expect(result.birthDate).toStrictEqual(dto.birthDate);
      expect(result.gender).toBe(dto.gender);
      expect(result.imageUrl).toBe(dto.imageUrl);
      expect(result.email).toBe(dto.email.toLowerCase());
      expect(result.primaryPhone).toBe(dto.primaryPhone);
      expect(result.secondaryPhone).toBe(dto.secondaryPhone);

      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          userDetails: expect.any(Object),
          createdAt: expect.any(Object),
          updatedAt: expect.any(Object),
        }),
      );
      expect(result._id).toBe(userId);

      expect(result.userDetails.instructions).toEqual(
        dto.userDetails.instructions,
      );
    });
  });

  describe('delete', () => {
    //TODO - add hard delete
    // it('should delete a user', async () => {
    //   const softDeleteSpy = jest.spyOn(repository, 'softDelete');
    //   const result = await Service.softDelete(new userEntityDoc());

    //   expect(softDeleteSpy).toHaveBeenCalled();
    //   expect(result).toBeInstanceOf(UserEntity);
    //   expect(result._id).toBe(userId);
    //   expect(result.deletedAt).toBeDefined();
    // });

    it('should soft delete a user', async () => {
      const softDeleteSpy = jest.spyOn(repository, 'findOneAndSoftDelete');
      const result = await service.softDelete(fakeUser._id);

      expect(softDeleteSpy).toHaveBeenCalled();
      expect(softDeleteSpy).toHaveBeenCalledWith(fakeUser._id);

      expect(result._id).toBe(userId);
      expect(result.deletedAt).toBeDefined();

      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          deletedAt: expect.any(Date),
        }),
      );
    });
  });

  afterAll(async () => {
    await killDatabaseConnection();
  });
});

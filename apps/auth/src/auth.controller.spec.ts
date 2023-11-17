import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterNewUserDto } from './dto/register-new-user.dto';
import { CreateStudentDto } from './student/dto/create-student.dto';
import { CreateTeacherDto } from './teacher/dto/create-teacher.dto';
import { CreateUserDto, UserRole } from './users/dto/create-user.dto';

import { AuthenticationService } from '@app/common/auth/services/auth.service';
import { DATABASE_CONNECTION_NAME } from '@app/common/database/constants/database.constant';
import { HelperDateService } from '@app/common/helper/services/helper.date.service';
import { HelperEncryptionService } from '@app/common/helper/services/helper.encryption.service';
import { HelperHashService } from '@app/common/helper/services/helper.hash.service';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc } from '../../../libs/common/src/entities/auth/user.entity';
import { StudentDoc } from './student/repository/entities/student.entity';
import { StudentRepositoryModule } from './student/repository/student.repository.module';
import { StudentModule } from './student/student.module';
import { StudentService } from './student/student.service';
import { TeacherDoc } from './teacher/repository/entities/teacher.entity';
import { TeacherRepositoryModule } from './teacher/repository/teacher.repository.module';
import { TeacherModule } from './teacher/teacher.module';
import { TeacherService } from './teacher/teacher.service';
import { UserRepositoryModule } from './users/repository/user.repository.module';
import { UsersModule } from './users/users.module';
import { UserService } from './users/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  let userService: UserService;
  let teacherService: TeacherService;
  let studentService: StudentService;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule,
        TeacherModule,
        StudentModule,
        UsersModule,
        TeacherRepositoryModule,
        StudentRepositoryModule,
        UserRepositoryModule,
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: 'mongodb://localhost:27017/t-auth-test',
            connectionName: DATABASE_CONNECTION_NAME,
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthenticationService,
        // TeacherService,
        // StudentService,
        // UsersService,
        // TeacherRepository,
        // UserRepository,
        // StudentRepository,
        JwtService,
        HelperHashService,
        HelperDateService,
        HelperEncryptionService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    userService = module.get<UserService>(UserService);
    teacherService = module.get<TeacherService>(TeacherService);
    studentService = module.get<StudentService>(StudentService);
  });

  describe('registerNewUser', () => {
    describe('registerNewUser', () => {
      it('should create a teacher when user role is Teacher', async () => {
        const userDto: CreateUserDto = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          role: UserRole.Teacher,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          middleName: faker.person.middleName(),
          birthDate: faker.date.past(),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          addressId: faker.string.uuid(),
          imageUrl: faker.image.avatar(),
          email: faker.internet.email(),
          primaryPhone: faker.phone.number(),
          secondaryPhone: faker.phone.number(),
          isDisabled: false,
          locked: false,
          details: { customField: faker.word.adjective() },
        };

        const teacherDto: CreateTeacherDto = {
          userId: faker.string.uuid(),
          certifications: { certification: faker.word.adjective() },
          hiredOn: faker.date.past(),
          details: { customField: faker.word.adjective() },
          effectiveAt: faker.date.future(),
        };

        const registerNewUserDto: RegisterNewUserDto = {
          user: userDto,
          teacher: teacherDto,
        };

        // Mock the authService's createPassword method to return an encryption object
        const encryption = {
          passwordHash: faker.string.uuid(),
          salt: faker.string.binary({ length: 16 }),
          passwordCreated: faker.date.past(),
        };
        const createPasswordSpy = jest
          .spyOn(authenticationService, 'createPassword')
          .mockResolvedValue(encryption);

        // Mock the userService's create method to return the created user
        const createdUser = {
          ...userDto,
          _id: faker.string.uuid(),
          updatedBy: faker.string.uuid(),
          effectiveAt: new Date(),
        };

        const createUserSpy = jest
          .spyOn(userService, 'create')
          .mockResolvedValue(createdUser as UserDoc);

        // Mock the teachersService's create method to return the created teacher
        const createdTeacher = {
          ...teacherDto,
          _id: faker.string.uuid(),
          userId: createdUser._id,
          updatedBy: faker.string.uuid(),
        };
        const createTeacherSpy = jest
          .spyOn(teacherService, 'create')
          .mockResolvedValue(createdTeacher as TeacherDoc);

        const result = await authController.registerNewUser(registerNewUserDto);

        expect(result).toMatchObject({ user: createdUser, ...createdTeacher });
        expect(createPasswordSpy).toHaveBeenCalledWith(userDto.password);
        expect(createUserSpy).toHaveBeenCalledWith({
          ...userDto,
          password: encryption.passwordHash,
        });
        expect(createTeacherSpy).toHaveBeenCalledWith({
          ...teacherDto,
          userId: createdUser._id,
        });
      });
    });

    it('should create a student when user role is Student', async () => {
      const userDto: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: UserRole.Student,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        middleName: faker.name.middleName(),
        birthDate: faker.date.past(),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        addressId: faker.string.uuid(),
        imageUrl: faker.image.avatar(),
        email: faker.internet.email(),
        primaryPhone: faker.phone.number(),
        secondaryPhone: faker.phone.number(),
        isDisabled: false,
        locked: false,
        details: { customField: faker.word.adjective() },
      };

      const studentDto: CreateStudentDto = {
        userId: faker.string.uuid(),
        specialNeeds: faker.word.noun(),
        enrolledOn: faker.date.past(),
        religion: faker.helpers.arrayElement([
          'Christianity',
          'Islam',
          'Hinduism',
          'Buddhism',
          'Sikhism',
          'Judaism',
          'Other',
        ]),
        details: { customField: faker.word.adjective() },
        effectiveAt: faker.date.future(),
      };

      const registerNewUserDto: RegisterNewUserDto = {
        user: userDto,
        student: studentDto,
      };

      const encryption = {
        passwordHash: faker.string.uuid(),
        salt: faker.string.binary({ length: 10 }),
        passwordCreated: faker.date.past(),
      };
      const createPasswordSpy = jest
        .spyOn(authenticationService, 'createPassword')
        .mockResolvedValue(encryption);

      const createdUser = {
        ...userDto,
        _id: faker.string.uuid(),
        updatedBy: faker.string.uuid(),
        effectiveAt: new Date(),
      };
      const createUserSpy = jest
        .spyOn(userService, 'create')
        .mockResolvedValue(createdUser as UserDoc);

      // Mock the teachersService's create method to return the created teacher
      const createdStudent = {
        ...studentDto,
        _id: faker.string.uuid(),
        updatedBy: faker.string.uuid(),
      };

      const createStudentSpy = jest
        .spyOn(studentService, 'create')
        .mockResolvedValue(createdStudent as StudentDoc);

      const result = await authController.registerNewUser(registerNewUserDto);

      expect(result).toMatchObject({ user: createdUser, ...createdStudent });
      expect(createPasswordSpy).toHaveBeenCalledWith(userDto.password);
      expect(createUserSpy).toHaveBeenCalledWith({
        ...userDto,
        password: encryption.passwordHash,
      });
      expect(createStudentSpy).toHaveBeenCalledWith({
        ...studentDto,
        userId: createdUser._id,
      });
    });

    it('should throw an error for an invalid user role', async () => {
      const userDto: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: 'InvalidRole' as UserRole,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        middleName: faker.name.middleName(),
        birthDate: faker.date.past(),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        addressId: faker.string.uuid(),
        imageUrl: faker.image.avatar(),
        email: faker.internet.email(),
        primaryPhone: faker.phone.number(),
        secondaryPhone: faker.phone.number(),
        isDisabled: false,
        locked: false,
        details: { customField: faker.word.adjective() },
      };

      const registerNewUserDto: RegisterNewUserDto = {
        user: userDto,
      };

      // const createdUser = {
      //   ...userDto,
      //   _id: faker.string.uuid(),
      //   updatedBy: faker.string.uuid(),
      //   effectiveAt: new Date(),
      // };

      // const createUserSpy = jest
      //   .spyOn(userService, 'create')
      //   .mockResolvedValue(createdUser as UserDoc);

      await expect(
        authController.registerNewUser(registerNewUserDto),
      ).rejects.toThrowError('Invalid user role');
    });
  });
});

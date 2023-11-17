import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import { killDatabaseConnection } from '../helpers/database.memory.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import configs from 'apps/auth/src/configs';
import { ConfigModule } from '@nestjs/config';

import { UpdateStudentDto } from 'apps/auth/src/student/dto/update-student.dto';
import { StudentRepository } from 'apps/auth/src/student/repository/repositories/student.repository';
import { StudentRepositoryModule } from 'apps/auth/src/student/repository/student.repository.module';
import { StudentService } from 'apps/auth/src/student/student.service';
import {
  StudentDoc,
  StudentEntity,
  StudentSchema,
} from 'apps/auth/src/student/repository/entities/student.entity';

import { fakeStudentDto } from './../stubs/student.stub';
import { CreateStudentDto } from 'apps/auth/src/student/dto/create-student.dto';
import { UserEntity, UserSchema } from '@app/common/entities/auth';
import { ENUM_STUDENT_STATUS_CODE_ERROR } from 'apps/auth/src/student/constants/student.status-code.constant';

// export const studentId = faker.string.uuid();
describe('StudentService', () => {
  let service: StudentService;
  let repository: StudentRepository;
  let fakeStudent: StudentDoc;
  let studentId: string;

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
          // connectionName: DATABASE_CONNECTION_NAME,
          imports: [DatabaseOptionsModule],
          inject: [DatabaseOptionsService],
          useFactory: async (databaseOptionsService: DatabaseOptionsService) =>
            databaseOptionsService.createOptions(),
        }),
        MongooseModule.forFeature([
          {
            name: StudentEntity.name,
            schema: StudentSchema,
          },
        ]),
        MongooseModule.forFeature([
          {
            name: UserEntity.name,
            schema: UserSchema,
          },
        ]),
        StudentRepositoryModule,
      ],
      providers: [StudentService],
    }).compile();

    service = moduleRefRef.get<StudentService>(StudentService);
    repository = moduleRefRef.get<StudentRepository>(StudentRepository);
    const userId = faker.string.uuid();

    fakeStudent = await service.create({ ...fakeStudentDto, userId });
    studentId = fakeStudent._id;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all student', async () => {
      const findAllSpy = jest.spyOn(repository, 'findAll');

      const result = await service.findAll();

      expect(findAllSpy).toHaveBeenCalled();
      expect(result.length).toEqual(1);
    });
  });

  describe('findOne', () => {
    it('should find student by id', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOneById');

      const result = await service.findById(fakeStudent._id);

      expect(findOneSpy).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith(fakeStudent._id, { join: true });
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
        }),
      );
      expect(result._id).toBe(fakeStudent._id);
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
    const userId = faker.string.uuid();

    it('should create new student', async () => {
      //NOTE - importing fake student from stub doesn't work as expected - I think maybe fakeAdress also using that so it won't be different in run-time
      const fakeStudentDto: CreateStudentDto = {
        specialNeeds: faker.lorem.words(3),
        enrolledOn: faker.date.past(),
        religion: faker.lorem.words(2),
        studentDetails: {
          instructions: faker.lorem.sentence(),
          workLifeBalance: faker.lorem.sentence(),
        },
      };

      const createSpy = jest.spyOn(repository, 'create');

      const result = await service.create({ ...fakeStudentDto, userId });

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        ...fakeStudentDto,
        userId,
        updatedBy: expect.any(String),
        effectiveAt: expect.any(Date),
      });

      expect(result._id).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
          studentDetails: expect.any(Object),
        }),
      );
    });

    it('should not create new student with duplicate userId linked with other student', async () => {
      //NOTE - importing fake student from stub doesn't work as expected - I think maybe fakeAdress also using that so it won't be different in run-time
      const fakeStudentDto: CreateStudentDto = {
        specialNeeds: faker.lorem.words(3),
        enrolledOn: faker.date.past(),
        religion: faker.lorem.words(2),
        studentDetails: {
          instructions: faker.lorem.sentence(),
          workLifeBalance: faker.lorem.sentence(),
        },
      };

      try {
        await service.create({
          ...fakeStudentDto,
          userId: fakeStudent.userId,
        });
        fail('Expected ConflictException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode:
            ENUM_STUDENT_STATUS_CODE_ERROR.STUDENT_ALREADY_LINKED_WITH_USER_ID,
          message: 'student.error.alreadyLinkedWithUserId',
        });
      }
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when ID is not found', async () => {
      const id = 'nonexistent-id';
      const updateStudentDto: UpdateStudentDto = {
        specialNeeds: 'worklifebalance',
      };

      try {
        await service.update(id, updateStudentDto);
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('student.error.notFound');
        expect(error.response).toEqual({
          statusCode: ENUM_STUDENT_STATUS_CODE_ERROR.STUDENT_NOT_FOUND_ERROR,
          message: 'student.error.notFound',
        });
      }
    });

    it('should update studentDetails object and retain old fields in it', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const oldFields = { ...fakeStudent.studentDetails };

      const studentDetails = {
        weekendAreNotForWork: faker.lorem.sentence(),
        fastIterationsAreBad: faker.lorem.sentence(),
      };

      const studentId = fakeStudent._id;
      const dto: UpdateStudentDto = {
        studentDetails,
      };

      const result = await service.update(studentId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(studentId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          studentDetails: expect.objectContaining({
            ...oldFields,
            ...studentDetails,
          }),
        }),
      );

      expect(result._id).toBe(studentId);
    });

    it('should update existing fields in studentDetails object', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const studentId = fakeStudent._id;
      const dto: UpdateStudentDto = {
        studentDetails: {
          instructions: faker.lorem.sentence(),
        },
      };

      const result = await service.update(studentId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(studentId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          studentDetails: expect.any(Object),
        }),
      );
      expect(result._id).toBe(studentId);
      expect(result.studentDetails.instructions).toEqual(
        dto.studentDetails.instructions,
      );
    });

    it('should update all fields of student entity at once', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const studentId = fakeStudent._id;

      const previousStudentDetailFields = {
        ...fakeStudent.studentDetails,
      };

      const dto: UpdateStudentDto = {
        specialNeeds: faker.lorem.words(3),
        enrolledOn: faker.date.past(),
        religion: faker.lorem.words(2),
        studentDetails: {
          instructions: faker.lorem.sentence(),
          workLifeBalance: faker.lorem.sentence(),
        },
      };

      const result = await service.update(studentId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(studentId, dto);

      expect(result._id).toBe(studentId);
      expect(result.specialNeeds).toBe(dto.specialNeeds);
      expect(result.enrolledOn).toStrictEqual(dto.enrolledOn);
      expect(result.religion).toBe(dto.religion);

      expect(result._id).toBe(studentId);
      expect(result.studentDetails.instructions).toEqual(
        dto.studentDetails.instructions,
      );
      expect(result.studentDetails.indiviuals).toEqual(
        dto.studentDetails.indiviuals,
      );

      expect(result.studentDetails.instructions).toEqual(
        dto.studentDetails.instructions,
      );
      expect(result.studentDetails.workLifeBalance).toEqual(
        dto.studentDetails.workLifeBalance,
      );

      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          effectiveAt: expect.any(Date),
          studentDetails: expect.objectContaining({
            ...previousStudentDetailFields,
            ...dto.studentDetails,
          }),
        }),
      );
    });
  });

  describe('delete', () => {
    //TODO - add hard delete
    // it('should delete a student', async () => {
    //   const softDeleteSpy = jest.spyOn(repository, 'softDelete');
    //   const result = await Service.softDelete(new studentEntityDoc());

    //   expect(softDeleteSpy).toHaveBeenCalled();
    //   expect(result).toBeInstanceOf(StudentEntity);
    //   expect(result._id).toBe(studentId);
    //   expect(result.deletedAt).toBeDefined();
    // });

    it('should soft delete a student', async () => {
      const softDeleteSpy = jest.spyOn(repository, 'findOneAndSoftDelete');
      const result = await service.softDelete(fakeStudent._id);

      expect(softDeleteSpy).toHaveBeenCalled();
      expect(softDeleteSpy).toHaveBeenCalledWith(fakeStudent._id);

      expect(result._id).toBe(studentId);
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

import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configs from 'apps/auth/src/configs';
import { killDatabaseConnection } from '../helpers/database.memory.module';

import { UpdateTeacherDto } from 'apps/auth/src/teacher/dto/update-teacher.dto';
import {
  TeacherDoc,
  TeacherEntity,
  TeacherSchema,
} from 'apps/auth/src/teacher/repository/entities/teacher.entity';
import { TeacherRepository } from 'apps/auth/src/teacher/repository/repositories/teacher.repository';
import { TeacherRepositoryModule } from 'apps/auth/src/teacher/repository/teacher.repository.module';
import { TeacherService } from 'apps/auth/src/teacher/teacher.service';

import {
  AddressEntity,
  AddressSchema,
  UserEntity,
  UserSchema,
} from '@app/common/entities/auth';
import { ENUM_TEACHER_STATUS_CODE_ERROR } from 'apps/auth/src/teacher/constants/teacher.status-code.constant';
import { CreateTeacherDto } from 'apps/auth/src/teacher/dto/create-teacher.dto';
import { fakeTeacherDto } from './../stubs/teacher.stub';

// export const teacherId = faker.string.uuid();
describe('TeacherService', () => {
  let service: TeacherService;
  let repository: TeacherRepository;
  let fakeTeacher: TeacherDoc;
  let teacherId: string;

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
            name: TeacherEntity.name,
            schema: TeacherSchema,
          },
        ]),
        MongooseModule.forFeature([
          {
            name: UserEntity.name,
            schema: UserSchema,
          },
        ]),
        MongooseModule.forFeature([
          {
            name: AddressEntity.name,
            schema: AddressSchema,
          },
        ]),
        TeacherRepositoryModule,
      ],
      providers: [TeacherService],
    }).compile();

    service = moduleRefRef.get<TeacherService>(TeacherService);
    repository = moduleRefRef.get<TeacherRepository>(TeacherRepository);
    const userId = faker.string.uuid();

    fakeTeacher = await service.create({ ...fakeTeacherDto, userId });
    teacherId = fakeTeacher._id;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all teacher', async () => {
      const findAllSpy = jest.spyOn(repository, 'findAll');

      const result = await service.findAll();

      expect(findAllSpy).toHaveBeenCalled();
      expect(result.length).toEqual(1);
    });
  });

  describe('findOne', () => {
    it('should find teacher by id', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOneById');

      const result = await service.findById(fakeTeacher._id);

      expect(findOneSpy).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith(fakeTeacher._id, { join: true });
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
        }),
      );
      expect(result._id).toBe(fakeTeacher._id);
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

    it('should create new teacher', async () => {
      //NOTE - importing fake teacher from stub doesn't work as expected - I think maybe fakeAdress also using that so it won't be different in run-time
      const fakeTeacherDto: CreateTeacherDto = {
        certifications: {
          certification1: faker.lorem.words(3),
          certification2: faker.lorem.words(3),
        },
        education: {
          university: faker.company.name(),
          degree: faker.lorem.words(2),
          startDate: faker.date.past().toISOString(),
          endDate: faker.date.past().toISOString(),
          country: faker.location.country(),
          city: faker.location.city(),
        },
        hiredOn: faker.date.past(),
        teacherDetails: {
          detail1: faker.lorem.sentence(),
          detail2: faker.lorem.sentence(),
        },
        cnic: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        highestQualification: faker.lorem.words(2),
        hasTrainingExperience: faker.datatype.boolean(),
        experienceYears: parseInt(
          faker.number.int({ min: 1, max: 99 }).toString(),
          10,
        ),
        hasTakmilEducation: faker.datatype.boolean(),
        isResident: faker.datatype.boolean(),
      };

      const createSpy = jest.spyOn(repository, 'create');

      const result = await service.create({ ...fakeTeacherDto, userId });

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        ...fakeTeacherDto,
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
        }),
      );
    });

    it('should not create new teacher with duplicate userId linked with other teacher', async () => {
      //NOTE - importing fake teacher from stub doesn't work as expected - I think maybe fakeAdress also using that so it won't be different in run-time
      const fakeTeacherDto: CreateTeacherDto = {
        certifications: {
          certification1: faker.lorem.words(3),
          certification2: faker.lorem.words(3),
        },
        education: {
          university: faker.company.name(),
          degree: faker.lorem.words(2),
          startDate: faker.date.past().toISOString(),
          endDate: faker.date.past().toISOString(),
          country: faker.location.country(),
          city: faker.location.city(),
        },
        hiredOn: faker.date.past(),
        teacherDetails: {
          detail1: faker.lorem.sentence(),
          detail2: faker.lorem.sentence(),
        },
        cnic: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        highestQualification: faker.lorem.words(2),
        hasTrainingExperience: faker.datatype.boolean(),
        experienceYears: parseInt(
          faker.number.int({ min: 1, max: 99 }).toString(),
          10,
        ),
        hasTakmilEducation: faker.datatype.boolean(),
        isResident: faker.datatype.boolean(),
      };

      try {
        await service.create({
          ...fakeTeacherDto,
          userId: fakeTeacher.userId,
        });
        fail('Expected ConflictException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode:
            ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_ALREADY_LINKED_WITH_USER_ID,
          message: 'teacher.error.alreadyLinkedWithUserId',
        });
      }
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when ID is not found', async () => {
      const id = 'nonexistent-id';
      const updateTeacherDto: UpdateTeacherDto = {
        cnic: '7485695854',
      };

      try {
        await service.update(id, updateTeacherDto);
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('teacher.error.notFound');
        expect(error.response).toEqual({
          statusCode: ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_NOT_FOUND_ERROR,
          message: 'teacher.error.notFound',
        });
      }
    });

    it('should not update teacher with duplicate cnic', async () => {
      const findOneByIdSpy = jest.spyOn(repository, 'findOneById');
      const updateTeacherDto: UpdateTeacherDto = {
        cnic: fakeTeacher.cnic,
      };

      try {
        await service.update(fakeTeacher._id, updateTeacherDto);
        fail('Expected ConflictException to be thrown');
      } catch (error) {
        expect(findOneByIdSpy).toHaveBeenCalled();
        expect(findOneByIdSpy).toHaveBeenCalledWith(teacherId, { join: true });
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode: ENUM_TEACHER_STATUS_CODE_ERROR.TEACHER_CNIC_EXIST_ERROR,
          message: 'teacher.error.cnicExists',
        });
      }
    });

    it('should update teacherDetails object and retain old fields in it', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const oldFields = { ...fakeTeacher.teacherDetails };

      const teacherDetails = {
        weekendAreNotForWork: faker.lorem.sentence(),
        fastIterationsAreBad: faker.lorem.sentence(),
      };

      const teacherId = fakeTeacher._id;
      const dto: UpdateTeacherDto = {
        teacherDetails,
      };

      const result = await service.update(teacherId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(teacherId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          teacherDetails: expect.objectContaining({
            ...teacherDetails,
            ...oldFields,
          }),
        }),
      );

      expect(result._id).toBe(teacherId);
    });

    it('should update existing fields in teacherDetails object', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const teacherId = fakeTeacher._id;
      const dto: UpdateTeacherDto = {
        teacherDetails: {
          instructions: faker.lorem.sentence(),
        },
      };

      const result = await service.update(teacherId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(teacherId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          teacherDetails: expect.any(Object),
        }),
      );
      expect(result._id).toBe(teacherId);
      expect(result.teacherDetails.instructions).toEqual(
        dto.teacherDetails.instructions,
      );
    });

    it('should update education object and retain old fields in it', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      // const oldFields = { ...fakeTeacher.education };

      const education = {
        university: faker.company.name(),
        degree: faker.lorem.words(2),
      };

      const teacherId = fakeTeacher._id;
      const dto: UpdateTeacherDto = {
        education,
      };

      const result = await service.update(teacherId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(teacherId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          education: expect.any(Object),
          //FIXME - unknwon calle ids must be something going wrong with jest strict-mode later check
          // education: expect.objectContaining({
          //   ...oldFields,
          //   ...education,
          // }),
          certifications: expect.any(Object),
          teacherDetails: expect.any(Object),
        }),
      );

      expect(result._id).toBe(teacherId);
    });

    it('should update all fields of teacher entity at once', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const teacherId = fakeTeacher._id;

      const dto: UpdateTeacherDto = {
        certifications: {
          certification1: faker.lorem.words(3),
          certification2: faker.lorem.words(3),
        },
        education: {
          university: faker.company.name(),
          degree: faker.lorem.words(2),
          startDate: faker.date.past().toISOString(),
          endDate: faker.date.past().toISOString(),
          country: faker.location.country(),
          city: faker.location.city(),
        },
        hiredOn: faker.date.past(),
        teacherDetails: {
          instructions: faker.lorem.sentence(),
          indiviuals: faker.lorem.sentence(),
        },
        cnic: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        highestQualification: faker.lorem.words(2),
        hasTrainingExperience: faker.datatype.boolean(),
        experienceYears: parseInt(
          faker.number.int({ min: 1, max: 99 }).toString(),
          10,
        ),
        hasTakmilEducation: faker.datatype.boolean(),
        isResident: faker.datatype.boolean(),
      };

      const result = await service.update(teacherId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(teacherId, dto);

      expect(result.certifications).toEqual(dto.certifications);
      expect(result.education).toEqual(dto.education);
      expect(result.hiredOn).toStrictEqual(dto.hiredOn);
      expect(result.teacherDetails).toEqual(dto.teacherDetails);
      expect(result.cnic).toBe(dto.cnic);
      expect(result.highestQualification).toBe(dto.highestQualification);
      expect(result.hasTrainingExperience).toBe(dto.hasTrainingExperience);
      expect(result.experienceYears).toBe(dto.experienceYears);
      expect(result.hasTakmilEducation).toBe(dto.hasTakmilEducation);
      expect(result.isResident).toBe(dto.isResident);

      expect(result._id).toBe(teacherId);
      expect(result.teacherDetails.instructions).toEqual(
        dto.teacherDetails.instructions,
      );
      expect(result.teacherDetails.indiviuals).toEqual(
        dto.teacherDetails.indiviuals,
      );

      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          education: expect.any(Object),
          certifications: expect.any(Object),
          teacherDetails: expect.any(Object),
        }),
      );
    });
  });

  describe('delete', () => {
    //TODO - add hard delete
    // it('should delete a teacher', async () => {
    //   const softDeleteSpy = jest.spyOn(repository, 'softDelete');
    //   const result = await Service.softDelete(new teacherEntityDoc());

    //   expect(softDeleteSpy).toHaveBeenCalled();
    //   expect(result).toBeInstanceOf(TeacherEntity);
    //   expect(result._id).toBe(teacherId);
    //   expect(result.deletedAt).toBeDefined();
    // });

    it('should soft delete a teacher', async () => {
      const softDeleteSpy = jest.spyOn(repository, 'findOneAndSoftDelete');
      const result = await service.softDelete(fakeTeacher._id);

      expect(softDeleteSpy).toHaveBeenCalled();
      expect(softDeleteSpy).toHaveBeenCalledWith(fakeTeacher._id);

      expect(result._id).toBe(teacherId);
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

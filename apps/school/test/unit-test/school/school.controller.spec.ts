import { Test, TestingModule } from '@nestjs/testing';
import {
  fakeAddressDto,
  fakeOrganizationDto,
} from './../../../../auth/test/unit-test/stubs/address.stub';
import { SchoolsController } from './../../../src/schools.controller';
import { fakeSchoolDto } from './../stubs/school.stub';

import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { killDatabaseConnection } from '../helpers/database.memory.module';

import configs from 'apps/school/src/configs';
import {
  SchoolDoc,
  SchoolEntity,
} from 'apps/school/src/repository/entities/school.entity';
import { SchoolRepository } from 'apps/school/src/repository/repositories/school.repository';
import { SchoolRepositoryModule } from 'apps/school/src/repository/school.repository.module';
import { SchoolService } from 'apps/school/src/school.service';

import { AddressDoc } from '@app/common/entities/auth';

import { AddressModule } from '@app/common/modules/address/address.module';
import { CreateAddressDto } from '@app/common/modules/address/dto/create-address.dto';
import { UpdateAddressDto } from '@app/common/modules/address/dto/update-address.dto';
import { CreateOrganizationDto } from 'apps/organization/src/dto/create-organization.dto';
import { ENUM_SCHOOL_STATUS_CODE_ERROR } from 'apps/school/src/constants/school.status-code.constant';
import { SchoolCreateDto } from 'apps/school/src/dto/school-create.dto';
import { SchoolUpdateDto } from 'apps/school/src/dto/school-update.dto';
import { UpdateSchoolDto } from 'apps/school/src/dto/update-school.dto';
import { UpdateOrganizationDto } from 'apps/school/src/organization/dto/update-organization.dto';
import { OrganizationModule } from 'apps/school/src/organization/organization.module';
import { OrganizationDoc } from 'apps/school/src/organization/repository/entities/organization.entity';

// export const schoolId = faker.string.uuid();
describe('SchoolService', () => {
  let controller: SchoolsController;
  let service: SchoolService;
  let repository: SchoolRepository;
  let fakeSchoolLocal: SchoolDoc;
  let schoolId: string;

  let schoolApp: INestApplication;

  afterAll(async () => {});

  beforeAll(async () => {
    const schoolModule: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
          isGlobal: true,
          cache: true,
          envFilePath: ['.env'],
          expandVariables: true,
        }),
        MongooseModule.forRootAsync({
          imports: [DatabaseOptionsModule],
          inject: [DatabaseOptionsService],
          useFactory: (databaseOptionsService: DatabaseOptionsService) =>
            databaseOptionsService.createOptions(),
        }),
        AddressModule,
        OrganizationModule,
        SchoolRepositoryModule,
      ],
      controllers: [SchoolsController],
      providers: [SchoolService],
    }).compile();

    schoolApp = schoolModule.createNestApplication();
    await schoolApp.init();

    controller = schoolModule.get<SchoolsController>(SchoolsController);
    service = schoolModule.get<SchoolService>(SchoolService);
    repository = schoolModule.get<SchoolRepository>(SchoolRepository);

    const createdSchoolWithOrganizationAndAddress = await service.create({
      ...fakeSchoolDto,
      address: fakeAddressDto,
      organization: fakeOrganizationDto,
    });

    const { ...restOfFields } = createdSchoolWithOrganizationAndAddress;

    fakeSchoolLocal = { ...restOfFields };
    schoolId = fakeSchoolLocal._id;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all school', async () => {
      const findAllSpy = jest.spyOn(service, 'findAll');

      const result = await controller.findAll();
      const [firstSchool] = result;

      expect(findAllSpy).toHaveBeenCalled();
      expect(firstSchool.name).toBe(fakeSchoolLocal.name);

      //TODO - add more assertion for object
      expect(firstSchool.addressId).toBeDefined();
      expect(firstSchool.organizationId).toBeDefined();
      expect(result.length).toEqual(1);
    });
  });

  describe('findOne', () => {
    //FIXME - address object being empty and the address that's being inserted before each test still not being reflected in other side - auth module, maybe it's bootstraped from here that's why or could be any reason right now, looks like both application have different contexts one that's being embeded and one that's original being triggered from school controller
    let fakeSchoolLocal: SchoolDoc;
    let fakeAddressLocal: AddressDoc;
    let fakeOrganizationLocal: OrganizationDoc;
    beforeAll(async () => {
      //NOTE - creted local seed data for it as global was so messed up before coming right up here, best to have untouched new seeded data
      const fakeSchoolDtoLocal = {
        name: faker.company.name(),
        status: faker.helpers.arrayElement(['Active', 'Inactive']),
        offline: faker.helpers.arrayElement([0, 1]),
        started: faker.date.past(),
        electricity: faker.lorem.word(),
        internet: faker.lorem.word(),
        schoolType: faker.lorem.word(),
        estimatedHousehold: faker.number.int(),
        spaceType: faker.lorem.word(),
        nearestSchool: faker.lorem.word(),
        model: faker.lorem.word(),
        // organizationId: faker.string.uuid(),
        // addressId: faker.string.uuid(),
        details: {
          instructions: faker.lorem.word(),
          workLifeBalance: faker.lorem.word(),
        },
      };

      const fakeAddressDtoLocal = {
        street: faker.location.street(),
        street1: faker.location.secondaryAddress(),
        council: faker.location.city(),
        town: faker.location.city(),
        tehsil: faker.location.county(),
        district: faker.location.county(),
        county: faker.location.county(),
        state: faker.location.state(),
        country: faker.location.country(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        addressDetails: {
          comments: faker.lorem.sentence(),
        },
      };

      const fakeOrganizationDtoLocal = {
        name: faker.company.name(),
        details: {
          comments: faker.lorem.sentence(),
        },
      };

      const createdSchoolWithOrganizationAndAddress = await service.create({
        ...fakeSchoolDtoLocal,
        address: fakeAddressDtoLocal,
        organization: fakeOrganizationDtoLocal,
      });

      const { address, organization, ...restOfFields } =
        createdSchoolWithOrganizationAndAddress;

      fakeSchoolLocal = { ...restOfFields };
      fakeAddressLocal = { ...address.toObject() };
      fakeOrganizationLocal = { ...organization.toObject() };
    });

    it('should find school by id along with address and organization', async () => {
      const findOneSpy = jest.spyOn(service, 'findById');

      const result = await controller.findOne(fakeSchoolLocal._id);

      expect(findOneSpy).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith(fakeSchoolLocal._id);
      expect(result.name).toBe(fakeSchoolLocal.name);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
          addressId: expect.objectContaining({
            street: fakeAddressLocal.street,
            street1: fakeAddressLocal.street1,
            council: fakeAddressLocal.council,
            town: fakeAddressLocal.town,
            tehsil: fakeAddressLocal.tehsil,
            addressDetails: expect.objectContaining({
              ...fakeAddressLocal.addressDetails,
            }),
          }),
          organizationId: expect.objectContaining({
            name: fakeOrganizationLocal.name,
            details: expect.objectContaining({
              ...fakeOrganizationLocal.details,
            }),
          }),
        }),
      );
      expect(result._id).toBe(fakeSchoolLocal._id);
    });

    it('should throwing exception if school not found', async () => {
      try {
        /* empty */
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.response).toEqual({
          statusCode: ENUM_SCHOOL_STATUS_CODE_ERROR.SCHOOL_NOT_FOUND_ERROR,
          message: 'school.error.notFound',
        });
      }
    });
  });

  describe('create', () => {
    const currentTime = new Date().getTime();
    it('should create new school with address and organization', async () => {
      const addressDto: CreateAddressDto = {
        street: faker.location.street(),
        street1: faker.location.secondaryAddress(),
        council: faker.location.city(),
        town: faker.location.city(),
        tehsil: faker.location.county(),
        district: faker.location.county(),
        county: faker.location.county(),
        state: faker.location.state(),
        country: faker.location.country(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        addressDetails: {
          comments: faker.lorem.sentence(),
        },
      };

      const organizationDto: CreateOrganizationDto = {
        name: faker.company.name(),
        details: {
          comments: faker.lorem.sentence(),
        },
      };

      const dto: SchoolCreateDto = {
        name: faker.company.name(),
        status: faker.helpers.arrayElement(['Active', 'Inactive']),
        offline: faker.helpers.arrayElement([0, 1]),
        started: faker.date.past(),
        electricity: faker.lorem.word(),
        internet: faker.lorem.word(),
        schoolType: faker.lorem.word(),
        model: faker.lorem.word(),
        estimatedHousehold: faker.number.int(),
        spaceType: faker.lorem.word(),
        nearestSchool: faker.lorem.word(),
        organization: organizationDto,
        address: addressDto,
        details: {
          instructions: faker.lorem.word(),
          workLifeBalance: faker.lorem.word(),
        },
      };

      const { ...dtoOnlySchool } = dto;

      const createSpy = jest.spyOn(service, 'create');
      const repositoryCreateSpy = jest.spyOn(repository, 'create');

      const result = await controller.create(dto);
      console.log(
        '🚀 ~ file: school.controller.spec.ts:300 ~ it ~ result:',
        result,
      );

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith(dto);

      const createSchoolDto = {
        ...dtoOnlySchool,
        addressId: result.address._id,
        organizationId: result.organization._id,
      };

      expect(repositoryCreateSpy).toHaveBeenCalledWith({
        ...createSchoolDto,
        updatedBy: expect.any(String),
        effectiveAt: expect.any(Date),
      });

      expect(result._id).toBeDefined();
      expect(result.addressId).toBeDefined();
      expect(result.organizationId).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedBy).toBeDefined();
      expect(result.effectiveAt).toBeDefined();

      const createdAtTime = new Date(result.createdAt).getTime();
      const updatedAtTime = new Date(result.updatedAt).getTime();
      const effectiveAtTime = new Date(result.effectiveAt).getTime();

      //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
      const timeThresholdInMillieSecond = 5000;

      expect(Math.abs(createdAtTime - currentTime)).toBeLessThanOrEqual(
        timeThresholdInMillieSecond,
      );

      expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
        timeThresholdInMillieSecond,
      );

      expect(Math.abs(effectiveAtTime - currentTime)).toBeLessThanOrEqual(
        timeThresholdInMillieSecond,
      );

      expect(result.details).toBeDefined();

      expect(result.name).toEqual(dto.name);
      expect(result.status).toEqual(dto.status);
      expect(result.offline).toEqual(dto.offline);
      expect(result.started).toEqual(dto.started);
      expect(result.electricity).toEqual(dto.electricity);
      expect(result.internet).toEqual(dto.internet);
      expect(result.schoolType).toEqual(dto.schoolType);
      expect(result.estimatedHousehold).toEqual(dto.estimatedHousehold);
      expect(result.spaceType).toEqual(dto.spaceType);
      expect(result.nearestSchool).toEqual(dto.nearestSchool);
      expect(result.organizationId).toEqual(result.organization._id);

      expect(result.details.instructions).toEqual(dto.details.instructions);
      expect(result.details.workLifeBalance).toEqual(
        dto.details.workLifeBalance,
      );

      expect(result.address).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          addressId: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
          address: expect.objectContaining({
            street: addressDto.street,
            street1: addressDto.street1,
            council: addressDto.council,
            town: addressDto.town,
            tehsil: addressDto.tehsil,
            district: addressDto.district,
            county: addressDto.county,
            state: addressDto.state,
            country: addressDto.country,
            latitude: addressDto.latitude,
            longitude: addressDto.longitude,
            addressDetails: expect.objectContaining({
              comments: addressDto.addressDetails.comments,
            }),
          }),
          organization: expect.objectContaining({
            name: organizationDto.name,
            details: expect.objectContaining({
              ...organizationDto.details,
            }),
          }),
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          addressId: expect.anything(),
          organizationId: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
          details: expect.objectContaining({
            ...dto.details,
          }),
        }),
      );
    });

    //NOTE - i think name should be enough to catch off request with duplicate dto's
    it('should throw exception creating school with same dto', async () => {
      const dto: SchoolCreateDto = {
        ...fakeSchoolDto,
        address: fakeAddressDto,
        organization: new CreateOrganizationDto(),
        model: '',
      };

      const existByNameSpy = jest.spyOn(service, 'existByName');

      try {
        expect(existByNameSpy).toHaveBeenCalled();
        expect(existByNameSpy).toHaveBeenCalledWith(dto.name);

        fail('Expected ConflictException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode: ENUM_SCHOOL_STATUS_CODE_ERROR.SCHOOL_ALREADY_EXIST_ERROR,
          message: 'school.error.nameAlreadyExist',
        });
      }
    });
  });

  describe('update', () => {
    describe('school only', () => {
      const currentTime = new Date().getTime();
      it('should throw NotFoundException when ID is not found', async () => {
        const id = 'nonexistent-id';
        const updateSchoolDto: UpdateSchoolDto = {
          spaceType: 'worklifebalance',
        };

        try {
          await controller.update(id, updateSchoolDto);
          fail('Expected NotFoundException to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('school.error.notFound');
          expect(error.response).toEqual({
            statusCode: ENUM_SCHOOL_STATUS_CODE_ERROR.SCHOOL_NOT_FOUND_ERROR,
            message: 'school.error.notFound',
          });
        }
      });

      it('should update schoolDetails object and retain old fields in it', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );

        const schoolDetails = {
          weekendAreNotForWork: faker.lorem.sentence(),
          fastIterationsAreBad: faker.lorem.sentence(),
        };

        const schoolId = fakeSchoolLocal._id;
        const dto: UpdateSchoolDto = {
          details: schoolDetails,
        };

        const result = await controller.update(schoolId, dto);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result.details.weekendAreNotForWork).toEqual(
          dto.details.weekendAreNotForWork,
        );
        expect(result.details.fastIterationsAreBad).toEqual(
          dto.details.fastIterationsAreBad,
        );

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );

        // assertions for old fields
        expect(result.details.instructions).toEqual(
          fakeSchoolLocal.details.instructions,
        );
        expect(result.details.workLifeBalance).toEqual(
          fakeSchoolLocal.details.workLifeBalance,
        );

        expect(result).toEqual(
          expect.objectContaining({
            _id: expect.anything(),
            details: expect.any(Object),
          }),
        );

        expect(result._id).toBe(schoolId);
      });

      it('should update existing fields in schoolDetails object', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );
        const schoolId = fakeSchoolLocal._id;
        const dto: UpdateSchoolDto = {
          details: {
            instructions: faker.lorem.sentence(),
          },
        };

        const result = await controller.update(schoolId, dto);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result).toEqual(
          expect.objectContaining({
            _id: expect.anything(),
            details: expect.any(Object),
          }),
        );
        expect(result._id).toBe(schoolId);
        expect(result.details.instructions).toEqual(dto.details.instructions);

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );
      });

      it('should update all fields of school entity at once', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );
        const schoolId = fakeSchoolLocal._id;

        const previousSchoolDetailFields = {
          ...fakeSchoolLocal.details,
        };

        //NOTE - maybe status shouldn't be passed like this
        const dto: UpdateSchoolDto = {
          name: faker.company.name(),
          status: faker.helpers.arrayElement(['Active', 'Inactive']),
          offline: faker.helpers.arrayElement([0, 1]),
          started: faker.date.past(),
          electricity: faker.lorem.word(),
          internet: faker.lorem.word(),
          schoolType: faker.lorem.word(),
          estimatedHousehold: faker.number.int(),
          spaceType: faker.lorem.word(),
          nearestSchool: faker.lorem.word(),
          organizationId: faker.string.uuid(),
          addressId: faker.string.uuid(),
          details: {
            instructions: faker.lorem.word(),
            workLifeBalance: faker.lorem.word(),
          },
        };

        const result = await controller.update(schoolId, dto);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result._id).toBe(schoolId);
        expect(result.name).toEqual(dto.name);
        expect(result.status).toBe(dto.status);
        expect(result.offline).toBe(dto.offline);
        expect(result.started).toEqual(dto.started);
        expect(result.electricity).toEqual(dto.electricity);
        expect(result.internet).toEqual(dto.internet);
        expect(result.schoolType).toEqual(dto.schoolType);
        expect(result.estimatedHousehold).toBe(dto.estimatedHousehold);
        expect(result.spaceType).toEqual(dto.spaceType);
        expect(result.nearestSchool).toEqual(dto.nearestSchool);
        expect(result.organizationId).toEqual(dto.organizationId);
        expect(result.addressId).toEqual(dto.addressId);
        expect(result.details.instructions).toEqual(dto.details.instructions);
        expect(result.details.workLifeBalance).toEqual(
          dto.details.workLifeBalance,
        );

        expect(result).toEqual(
          expect.objectContaining({
            _id: expect.anything(),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            effectiveAt: expect.any(Date),
            details: expect.objectContaining({
              ...previousSchoolDetailFields,
              ...dto.details,
            }),
          }),
        );

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );
      });
    });

    describe('school with address and organization', () => {
      const currentTime = new Date().getTime();
      let fakeSchoolLocal: SchoolDoc;
      let fakeAddressLocal: AddressDoc;
      let fakeOrganizationLocal: OrganizationDoc;

      beforeAll(async () => {
        //NOTE - creted local seed data for it as global was so messed up before coming right up here, best to have untouched new seeded data
        const fakeSchoolDtoLocal = {
          name: faker.company.name(),
          status: faker.helpers.arrayElement(['Active', 'Inactive']),
          offline: faker.helpers.arrayElement([0, 1]),
          started: faker.date.past(),
          electricity: faker.lorem.word(),
          internet: faker.lorem.word(),
          schoolType: faker.lorem.word(),
          estimatedHousehold: faker.number.int(),
          spaceType: faker.lorem.word(),
          nearestSchool: faker.lorem.word(),
          model: faker.lorem.word(),
          // organizationId: faker.string.uuid(),
          // addressId: faker.string.uuid(),
          details: {
            instructions: faker.lorem.word(),
            workLifeBalance: faker.lorem.word(),
          },
        };

        const fakeAddressDtoLocal = {
          street: faker.location.street(),
          street1: faker.location.secondaryAddress(),
          council: faker.location.city(),
          town: faker.location.city(),
          tehsil: faker.location.county(),
          district: faker.location.county(),
          county: faker.location.county(),
          state: faker.location.state(),
          country: faker.location.country(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          addressDetails: {
            comments: faker.lorem.sentence(),
          },
        };

        const fakeOrganizationDtoLocal = {
          name: faker.company.name(),
          details: {
            comments: faker.lorem.sentence(),
          },
        };

        const createdSchoolWithOrganizationAndAddress = await service.create({
          ...fakeSchoolDtoLocal,
          address: fakeAddressDtoLocal,
          organization: fakeOrganizationDtoLocal,
        });

        const { address, organization, ...restOfFields } =
          createdSchoolWithOrganizationAndAddress;

        fakeSchoolLocal = { ...restOfFields };
        fakeAddressLocal = { ...address.toObject() };
        fakeOrganizationLocal = { ...organization.toObject() };
      });

      it('should update school fields along with address and organization fields', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );

        const schoolId = fakeSchoolLocal._id;

        const updateAddressDto: UpdateAddressDto = {
          street1: '71, Montgomery, Ville-nick',
        };

        const updateOrganizationDto: UpdateOrganizationDto = {
          name: '72, Montgomery',
        };

        const dto: SchoolUpdateDto = {
          name: 'Saint Montgomery 454',
          address: updateAddressDto,
          organization: updateOrganizationDto,
        };

        const result: SchoolEntity & { address?: AddressDoc } & {
          organization?: OrganizationDoc;
        } = await controller.update(schoolId, dto);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result.name).toEqual(dto.name);

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();

        expect(result.address).toBeDefined();
        expect(result.address.street1).toEqual(updateAddressDto.street1);

        expect(result.organization).toBeDefined();
        expect(result.organization.name).toEqual(updateOrganizationDto.name);

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );

        // assertions for old fields
        expect(result.details.instructions).toEqual(
          fakeSchoolLocal.details.instructions,
        );
        expect(result.details.workLifeBalance).toEqual(
          fakeSchoolLocal.details.workLifeBalance,
        );

        expect(result).toEqual(
          expect.objectContaining({
            _id: expect.anything(),
            details: expect.any(Object),
          }),
        );

        expect(result._id).toBe(schoolId);
      });

      it('should update schoolDetails object and addressDetail and organizationDetail object and retain old fields in it', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );

        const oldAddressDetails = {
          ...fakeAddressLocal.addressDetails,
        };

        const oldOrganizationDetails = {
          ...fakeOrganizationLocal.details,
        };

        const oldSchoolDetails = {
          ...fakeSchoolLocal.details,
        };

        const schoolDetails = {
          weekendAreNotForWork: faker.lorem.sentence(),
          fastIterationsAreBad: faker.lorem.sentence(),
        };

        const schoolId = fakeSchoolLocal._id;

        const updateAddressDto: UpdateAddressDto = {
          addressDetails: {
            additions: faker.lorem.sentence(),
            instructions: faker.lorem.sentence(),
          },
        };

        const updateOrganizationDto: UpdateOrganizationDto = {
          details: {
            additions: faker.lorem.sentence(),
          },
        };

        const dto: SchoolUpdateDto = {
          name: 'Montgomery 71',
          details: schoolDetails,
          address: updateAddressDto,
          organization: updateOrganizationDto,
        };

        const result: SchoolEntity & { address?: AddressDoc } & {
          organization?: OrganizationDoc;
        } = await controller.update(schoolId, dto);
        console.log(
          '🚀 ~ file: school.controller.spec.ts:823 ~ it ~ result:',
          result,
        );
        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result.details.weekendAreNotForWork).toEqual(
          dto.details.weekendAreNotForWork,
        );
        expect(result.details.fastIterationsAreBad).toEqual(
          dto.details.fastIterationsAreBad,
        );

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();
        expect(result.address).toBeDefined();
        expect(result.organization).toBeDefined();

        expect(result.name).toEqual(dto.name);

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );

        expect(result.details.instructions).toEqual(
          fakeSchoolLocal.details.instructions,
        );
        expect(result.details.workLifeBalance).toEqual(
          fakeSchoolLocal.details.workLifeBalance,
        );

        expect(result).toEqual(
          expect.objectContaining({
            _id: expect.anything(),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            effectiveAt: expect.any(Date),
            details: expect.objectContaining({
              ...oldSchoolDetails,
              ...dto.details,
            }),
            address: expect.objectContaining({
              addressDetails: expect.objectContaining({
                ...oldAddressDetails,
                ...updateAddressDto.addressDetails,
              }),
            }),
            organization: expect.objectContaining({
              details: expect.objectContaining({
                ...oldOrganizationDetails,
                ...updateOrganizationDto.details,
              }),
            }),
          }),
        );

        expect(result._id).toBe(schoolId);
      });

      it('should update all fields of address and organization', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );
        const schoolId = fakeSchoolLocal._id;

        const latitude = faker.location.latitude();
        const longitude = faker.location.longitude();
        const county = faker.location.county();
        const state = faker.location.state();
        const country = faker.location.country();
        const street = faker.location.street();
        const street1 = faker.location.secondaryAddress();
        const council = faker.location.city();
        const town = faker.location.city();
        const tehsil = faker.location.county();
        const district = faker.location.county();

        const addressDto: UpdateAddressDto = {
          latitude,
          longitude,
          county,
          state,
          country,
          street,
          street1,
          council,
          town,
          tehsil,
          district,
          addressDetails: {
            instructions: faker.lorem.sentence(),
          },
        };

        const updateOrganizationDto: UpdateOrganizationDto = {
          name: faker.company.name(),
          details: {
            comments: faker.lorem.sentence(),
          },
        };

        const dto: SchoolUpdateDto = {
          address: addressDto,
          organization: updateOrganizationDto,
        };

        const result: SchoolEntity & { address?: AddressDoc } & {
          organization?: OrganizationDoc;
        } = await controller.update(schoolId, dto);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result._id).toBe(schoolId);

        expect(result.address.latitude).toBe(latitude);
        expect(result.address.longitude).toBe(longitude);
        expect(result.address.county).toBe(county);
        expect(result.address.state).toBe(state);
        expect(result.address.country).toBe(country);
        expect(result.address.street).toBe(street);
        expect(result.address.street1).toBe(street1);
        expect(result.address.council).toBe(council);
        expect(result.address.town).toBe(town);
        expect(result.address.tehsil).toBe(tehsil);
        expect(result.address.district).toBe(district);
        expect(result.address.addressDetails.instructions).toEqual(
          addressDto.addressDetails.instructions,
        );

        expect(result.organization.name).toBe(updateOrganizationDto.name);
        expect(result.organization.details).toEqual(
          updateOrganizationDto.details,
        );

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );
      });

      it('should update all fields of address only', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );
        const schoolId = fakeSchoolLocal._id;

        const latitude = faker.location.latitude();
        const longitude = faker.location.longitude();
        const county = faker.location.county();
        const state = faker.location.state();
        const country = faker.location.country();
        const street = faker.location.street();
        const street1 = faker.location.secondaryAddress();
        const council = faker.location.city();
        const town = faker.location.city();
        const tehsil = faker.location.county();
        const district = faker.location.county();

        const addressDto: UpdateAddressDto = {
          latitude,
          longitude,
          county,
          state,
          country,
          street,
          street1,
          council,
          town,
          tehsil,
          district,
          addressDetails: {
            instructions: faker.lorem.sentence(),
          },
        };

        const dto: SchoolUpdateDto = {
          address: addressDto,
        };

        const result: SchoolEntity & { address?: AddressDoc } =
          await controller.update(schoolId, dto);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result._id).toBe(schoolId);

        expect(result.address.latitude).toBe(latitude);
        expect(result.address.longitude).toBe(longitude);
        expect(result.address.county).toBe(county);
        expect(result.address.state).toBe(state);
        expect(result.address.country).toBe(country);
        expect(result.address.street).toBe(street);
        expect(result.address.street1).toBe(street1);
        expect(result.address.council).toBe(council);
        expect(result.address.town).toBe(town);
        expect(result.address.tehsil).toBe(tehsil);
        expect(result.address.district).toBe(district);
        expect(result.address.addressDetails.instructions).toEqual(
          addressDto.addressDetails.instructions,
        );

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );
      });

      it('should update all fields of organization only', async () => {
        const updateSpy = jest.spyOn(service, 'update');
        const findByIdAndUpdateSpy = jest.spyOn(
          repository,
          'findByIdAndUpdate',
        );
        const schoolId = fakeSchoolLocal._id;

        const updateOrganizationDto: UpdateOrganizationDto = {
          name: faker.company.name(),
          details: {
            comments: faker.lorem.sentence(),
          },
        };

        const dto: SchoolUpdateDto = {
          organization: updateOrganizationDto,
        };

        const result: SchoolEntity & {
          organization?: OrganizationDoc;
        } = await controller.update(schoolId, dto);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(schoolId, dto);

        expect(findByIdAndUpdateSpy).toHaveBeenCalled();

        expect(result._id).toBe(schoolId);

        expect(result.organization.name).toBe(updateOrganizationDto.name);
        expect(result.organization.details).toEqual(
          updateOrganizationDto.details,
        );

        expect(result.createdAt).toBeDefined();
        expect(result.updatedBy).toBeDefined();
        expect(result.effectiveAt).toBeDefined();

        const updatedAtTime = new Date(result.updatedAt).getTime();

        //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
        const timeThresholdInMillieSecond = 5000;

        expect(Math.abs(updatedAtTime - currentTime)).toBeLessThanOrEqual(
          timeThresholdInMillieSecond,
        );
      });
    });
  });

  describe('delete', () => {
    //TODO - add hard delete
    // it('should delete a school', async () => {
    //   const softDeleteSpy = jest.spyOn(service, 'softDelete');
    //   const result = await Service.softDelete(new schoolEntityDoc());

    //   expect(softDeleteSpy).toHaveBeenCalled();
    //   expect(result).toBeInstanceOf(SchoolEntity);
    //   expect(result._id).toBe(schoolId);
    //   expect(result.deletedAt).toBeDefined();
    // });

    const currentTime = new Date().getTime();
    it('should soft delete a school', async () => {
      const findOneAndSoftDeleteSpy = jest.spyOn(
        repository,
        'findOneAndSoftDelete',
      );
      const softDeleteSpy = jest.spyOn(service, 'softDelete');
      const result = await controller.remove(fakeSchoolLocal._id);

      expect(softDeleteSpy).toHaveBeenCalled();
      expect(softDeleteSpy).toHaveBeenCalledWith(fakeSchoolLocal._id);

      expect(findOneAndSoftDeleteSpy).toHaveBeenCalled();
      expect(findOneAndSoftDeleteSpy).toHaveBeenCalledWith(fakeSchoolLocal._id);

      expect(result._id).toBe(schoolId);
      expect(result.deletedAt).toBeDefined();

      const deletedAtTime = new Date(result.deletedAt).getTime();

      //NOTE - it's value being too much dynamic depending upon hardware ramping it up for safe area
      const timeThresholdInMillieSecond = 5000;

      expect(Math.abs(deletedAtTime - currentTime)).toBeLessThanOrEqual(
        timeThresholdInMillieSecond,
      );

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

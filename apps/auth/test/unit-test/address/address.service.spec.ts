import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import {
  AddressDoc,
  AddressEntity,
  AddressSchema,
} from '@app/common/entities/auth';
import { AddressService } from '@app/common/modules/address/address.service';
import { ENUM_ADDRESS_STATUS_CODE_ERROR } from '@app/common/modules/address/constants/address.status-code.constant';
import { UpdateAddressDto } from '@app/common/modules/address/dto/update-address.dto';
import { AddressRepositoryModule } from '@app/common/modules/address/repository/address.repository.module';
import { AddressRepository } from '@app/common/modules/address/repository/repositories/address.repository';
import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configs from 'apps/auth/src/configs';
import { ENUM_USER_STATUS_CODE_ERROR } from 'apps/auth/src/users/constants/user.status-code.constant';
import { killDatabaseConnection } from '../helpers/database.memory.module';
import { fakeAddressDto } from '../stubs/address.stub';
// export const addressId = faker.string.uuid();
describe('AddressService', () => {
  let service: AddressService;
  let repository: AddressRepository;
  let fakeAddress: AddressDoc;
  let addressId: string;

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
            await databaseOptionsService.createOptions(),
        }),
        MongooseModule.forFeature([
          {
            name: AddressEntity.name,
            schema: AddressSchema,
          },
        ]),
        AddressRepositoryModule,
      ],
      providers: [AddressService],
    }).compile();

    service = moduleRefRef.get<AddressService>(AddressService);
    repository = moduleRefRef.get<AddressRepository>(AddressRepository);

    fakeAddress = await service.create(fakeAddressDto);
    addressId = fakeAddress._id;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all address', async () => {
      const findAllSpy = jest.spyOn(repository, 'findAll');

      const result = await service.findAll();

      expect(findAllSpy).toHaveBeenCalled();
      expect(result.length).toEqual(1);
    });
  });

  describe('findOneById', () => {
    it('should find address by id', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOneById');

      const result = await service.findById(fakeAddress._id);

      expect(findOneSpy).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith(fakeAddress._id);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
          updatedBy: expect.any(String),
        }),
      );
      expect(result._id).toBe(fakeAddress._id);
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
    it('should create new address', async () => {
      //NOTE - importing fake address from stub doesn't work as expected - I think maybe fakeAdress also using that so it won't be different in run-time
      const fakeAddressDto = {
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

      const createSpy = jest.spyOn(repository, 'create');

      const result = await service.create(fakeAddressDto);

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        ...fakeAddressDto,
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

    describe('create duplication', () => {
      it('should not allow duplicate address', async () => {
        const findOneSpy = jest.spyOn(repository, 'findOne');
        try {
          await service.create(fakeAddressDto);
          fail('Expected ConflictException to be thrown');
        } catch (error) {
          expect(findOneSpy).toHaveBeenCalled();
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.response).toEqual({
            statusCode: ENUM_ADDRESS_STATUS_CODE_ERROR.ADDRESS_EXISTS_ERROR,
            message: 'address.error.addressAlreadyExist',
          });
        }
      });

      it('should not allow duplicated latitude & longtitude', async () => {
        const findOneSpy = jest.spyOn(repository, 'findOne');
        const fakeAddressDto = {
          street: faker.location.street(),
          street1: faker.location.secondaryAddress(),
          council: faker.location.city(),
          town: faker.location.city(),
          tehsil: faker.location.county(),
          district: faker.location.county(),
          county: faker.location.county(),
          state: faker.location.state(),
          country: faker.location.country(),
          latitude: fakeAddress.latitude,
          longitude: fakeAddress.longitude,
          addressDetails: {
            comments: faker.lorem.sentence(),
          },
        };
        try {
          await service.create(fakeAddressDto);
          fail('Expected ConflictException to be thrown');
        } catch (error) {
          expect(findOneSpy).toHaveBeenCalled();
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.response).toEqual({
            statusCode: ENUM_ADDRESS_STATUS_CODE_ERROR.ADDRESS_EXISTS_ERROR,
            message: 'address.error.addressAlreadyExist',
          });
        }
      });

      it('should not allow same exact street & street 1 address as other addresses', async () => {
        const findOneSpy = jest.spyOn(repository, 'findOne');
        const fakeAddressDto = {
          street: fakeAddress.street,
          street1: fakeAddress.street1,
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
        try {
          await service.create(fakeAddressDto);
          fail('Expected ConflictException to be thrown');
        } catch (error) {
          expect(findOneSpy).toHaveBeenCalled();
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.response).toEqual({
            statusCode: ENUM_ADDRESS_STATUS_CODE_ERROR.ADDRESS_EXISTS_ERROR,
            message: 'address.error.addressAlreadyExist',
          });
        }
      });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when ID is not found', async () => {
      // Mock the repository's findById method to return null (ID not found)
      jest.spyOn(repository, 'findOneById');

      const id = 'nonexistent-id';
      const updateAddressDto = {
        latitude: 69.2,
      };

      try {
        await service.update(id, updateAddressDto);
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('address.error.notFound');
        expect(error.response).toEqual({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
          message: 'address.error.notFound',
        });
      }
    });

    it('should update latitude & longitude values', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');

      const latitude = faker.location.latitude();
      const longitude = faker.location.longitude();
      const addressId = fakeAddress._id;
      const dto: UpdateAddressDto = {
        latitude,
        longitude,
      };

      const result = await service.update(addressId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(addressId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
        }),
      );
      expect(result._id).toBe(addressId);
      expect(result.latitude).toBe(latitude);
      expect(result.longitude).toBe(longitude);
    });

    it('should update country & country & state values', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const county = faker.location.county();
      const state = faker.location.state();
      const country = faker.location.country();

      const addressId = fakeAddress._id;
      const dto: UpdateAddressDto = {
        county,
        state,
        country,
      };

      const result = await service.update(addressId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(addressId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
        }),
      );
      expect(result._id).toBe(addressId);
      expect(result.county).toBe(county);
      expect(result.state).toBe(state);
      expect(result.country).toBe(country);
    });

    it('should update street & street1 & council & town & tehsil & district values', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const street = faker.location.street();
      const street1 = faker.location.secondaryAddress();
      const council = faker.location.city();
      const town = faker.location.city();
      const tehsil = faker.location.county();
      const district = faker.location.county();

      const addressId = fakeAddress._id;
      const dto: UpdateAddressDto = {
        street,
        street1,
        council,
        town,
        tehsil,
        district,
      };

      const result = await service.update(addressId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(addressId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          effectiveAt: expect.any(Date),
        }),
      );
      expect(result._id).toBe(addressId);
      expect(result.street).toBe(street);
      expect(result.street1).toBe(street1);
      expect(result.council).toBe(council);
      expect(result.town).toBe(town);
      expect(result.tehsil).toBe(tehsil);
      expect(result.district).toBe(district);
    });

    it('should update addressDetails object and retain old fields in it', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const oldFields = { ...fakeAddress.addressDetails };
      console.log(
        '🚀 ~ file: address.service.spec.ts:335 ~ it ~ oldFields:',
        oldFields,
      );
      const addressDetails = {
        instructions: faker.lorem.sentence(),
      };

      const addressId = fakeAddress._id;
      const dto: UpdateAddressDto = {
        addressDetails,
      };

      const result = await service.update(addressId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(addressId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          addressDetails: expect.objectContaining({
            // instructions: addressDetails.instructions,
            ...addressDetails,
            ...oldFields,
          }),
        }),
      );

      expect(result._id).toBe(addressId);
    });

    it('should update existing fields in addressDetails object', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
      const addressId = fakeAddress._id;
      const dto: UpdateAddressDto = {
        addressDetails: {
          comments: faker.lorem.sentence(),
        },
      };

      const result = await service.update(addressId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(addressId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          addressDetails: expect.any(Object),
        }),
      );
      expect(result._id).toBe(addressId);
      expect(result.addressDetails.comments).toEqual(
        dto.addressDetails.comments,
      );
    });

    it('should update all field of address entity at once', async () => {
      const findByIdAndUpdateSpy = jest.spyOn(repository, 'findByIdAndUpdate');
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

      const addressId = fakeAddress._id;
      const dto: UpdateAddressDto = {
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

      const result = await service.update(addressId, dto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalled();
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(addressId, dto);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          addressDetails: expect.any(Object),
        }),
      );
      expect(result._id).toBe(addressId);
      expect(result.latitude).toBe(latitude);
      expect(result.longitude).toBe(longitude);
      expect(result.county).toBe(county);
      expect(result.state).toBe(state);
      expect(result.country).toBe(country);
      expect(result.street).toBe(street);
      expect(result.street1).toBe(street1);
      expect(result.council).toBe(council);
      expect(result.town).toBe(town);
      expect(result.tehsil).toBe(tehsil);
      expect(result.district).toBe(district);
      expect(result.addressDetails.instructions).toEqual(
        dto.addressDetails.instructions,
      );
    });
  });

  describe('delete', () => {
    //TODO - add hard delete
    // it('should delete a address', async () => {
    //   const softDeleteSpy = jest.spyOn(repository, 'softDelete');
    //   const result = await Service.softDelete(new addressEntityDoc());

    //   expect(softDeleteSpy).toHaveBeenCalled();
    //   expect(result).toBeInstanceOf(AddressEntity);
    //   expect(result._id).toBe(addressId);
    //   expect(result.deletedAt).toBeDefined();
    // });

    it('should soft delete a address', async () => {
      const softDeleteSpy = jest.spyOn(repository, 'findOneAndSoftDelete');
      const result = await service.softDelete(fakeAddress._id);

      expect(softDeleteSpy).toHaveBeenCalled();
      expect(softDeleteSpy).toHaveBeenCalledWith(fakeAddress._id);

      expect(result._id).toBe(addressId);
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

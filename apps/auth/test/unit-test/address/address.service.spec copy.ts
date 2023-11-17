import { Test, TestingModule } from '@nestjs/testing';

import { AddressService } from '@app/common/modules/address/address.service';

import { UpdateAddressDto } from '@app/common/modules/address/dto/update-address.dto';
import { AddressRepository } from '@app/common/modules/address/repository/repositories/address.repository';
import { mockAddrssRepository } from '../__mocks__/address.mock.repository';
import {
  addressEntityDoc,
  addressId,
  addressOptionalFields,
  fakeAddressDto,
} from '../stubs/address.stub';
// export const addressId = faker.string.uuid();
describe('AddressService', () => {
  let service: AddressService;
  let repository: AddressRepository;
  beforeEach(async () => {
    const moduleRefRef: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: AddressRepository,
          useValue: mockAddrssRepository,
        },
      ],
    }).compile();

    service = moduleRefRef.get<AddressService>(AddressService);
    repository = moduleRefRef.get<AddressRepository>(AddressRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all address', async () => {
      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result.length).toEqual(2);
    });
  });

  describe('findOneById', () => {
    it('should find address by id', async () => {
      const result = await service.findById('id');

      expect(repository.findOneById).toHaveBeenCalled();
      expect(result).toBeInstanceOf(addressEntityDoc);
      expect(result._id).toBe('id');
    });
  });

  describe('getTotal', () => {
    it('should get total number of settings', async () => {
      const result = await service.getTotal();

      expect(repository.getTotal).toHaveBeenCalled();
      expect(typeof result).toBe('number');
      expect(result).toBe(1);
    });
  });

  describe('create', () => {
    it('should create new address', async () => {
      const result = await service.create(fakeAddressDto);

      expect(repository.create).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith({
        ...fakeAddressDto,
        ...addressOptionalFields,
        effectiveAt: expect.any(Date),
      });
      expect(result).toBeInstanceOf(addressEntityDoc);
      expect(result._id).toBe(addressId);
    });
  });

  describe('update', () => {
    it('should update address value', async () => {
      const latitude = 52.3;
      const longitude = 59.3;

      const dto: UpdateAddressDto = {
        latitude,
        longitude,
      };

      const result = await service.update(addressId, dto);
      console.log(
        '🚀 ~ file: address.service.spec.ts:135 ~ it ~ result:',
        result,
      );

      expect(repository.findByIdAndUpdate).toHaveBeenCalled();
      expect(repository.findByIdAndUpdate).toHaveBeenCalledWith(addressId, dto);
      expect(result).toBeInstanceOf(addressEntityDoc);
      expect(result._id).toBe(addressId);
      expect(result.latitude).toBe(latitude);
      expect(result.longitude).toBe(longitude);
    });
  });

  describe('delete', () => {
    it('should delete a address', async () => {
      const result = await Service.softDelete(new addressEntityDoc());

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBeInstanceOf(addressEntityDoc);
      expect(result._id).toBe(addressId);
    });
  });
});

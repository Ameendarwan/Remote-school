import {
  IDatabaseExistOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from '@app/common/database/interfaces/database.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../../../../../apps/auth/src/users/constants/user.status-code.constant';
import { AddressDoc } from '../../entities/auth/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './repository/repositories/address.repository';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async create(createAddressDto: CreateAddressDto) {
    try {
      const { latitude, longitude } = createAddressDto;

      if (latitude !== 0 && longitude !== 0) {
        const addressExist = await this.addressRepository.findOne({
          latitude,
          longitude,
        });

        if (addressExist) {
          return addressExist;
          // throw new ConflictException({
          //   statusCode: ENUM_ADDRESS_STATUS_CODE_ERROR.ADDRESS_EXISTS_ERROR,
          //   message: 'address.error.addressAlreadyExist',
          // });
        }
      }

      return this.addressRepository.create({
        ...createAddressDto,
        updatedBy: 'Admin',
        effectiveAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to create address: ${error.message}`);
    }
  }

  async existsByLatitudeAndLongtitude(
    dto: { latitude: number; longitude: number },
    options?: IDatabaseExistOptions,
  ) {
    const { latitude, longitude } = dto;

    return this.addressRepository.exists(
      { latitude, longitude },
      { ...options, withDeleted: true },
    );
  }

  async findById(id: string): Promise<AddressDoc | null> {
    const address = await this.addressRepository.findOneById(id);
    if (!address) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'address.error.notFound',
      });
    }

    return address;
  }

  async findAll(): Promise<AddressDoc[]> {
    return this.addressRepository.findAll({});
  }

  async validateUpdatedAddressData(id: string): Promise<AddressDoc | null> {
    const address = this.findById(id);
    return address;
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDoc | null> {
    const address = await this.findById(id);

    if (updateAddressDto.addressDetails) {
      updateAddressDto.addressDetails = {
        ...address.addressDetails,
        ...updateAddressDto.addressDetails,
      };
    }

    return this.addressRepository.findByIdAndUpdate(
      address._id,
      updateAddressDto,
    );
  }

  async softDelete(id: string): Promise<AddressDoc | null> {
    return this.addressRepository.findOneAndSoftDelete(id);
  }

  async delete(
    repository: AddressDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AddressDoc> {
    return this.addressRepository.softDelete(repository, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.addressRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.addressRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.addressRepository.softDeleteMany(find, options);
  }
}

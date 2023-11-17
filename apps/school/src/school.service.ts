import {
  IDatabaseExistOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from '@app/common/database/interfaces/database.interface';
import { AddressService } from '@app/common/modules/address/address.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ENUM_SCHOOL_STATUS_CODE_ERROR } from './constants/school.status-code.constant';
import { SchoolCreateDto } from './dto/school-create.dto';
import { SchoolUpdateDto } from './dto/school-update.dto';
import { OrganizationService } from './organization/organization.service';
import { SchoolDoc } from './repository/entities/school.entity';
import { SchoolRepository } from './repository/repositories/school.repository';

@Injectable()
export class SchoolService {
  constructor(
    private readonly schoolRepository: SchoolRepository,
    private readonly addressService: AddressService,
    private readonly organizationService: OrganizationService,
  ) {}

  async create(createSchoolDto: SchoolCreateDto) {
    const { name } = createSchoolDto;

    const schoolExist = await this.existByName(name);

    if (schoolExist) {
      throw new ConflictException({
        statusCode: ENUM_SCHOOL_STATUS_CODE_ERROR.SCHOOL_ALREADY_EXIST_ERROR,
        message: 'school.error.nameAlreadyExist',
      });
    }

    const { address, organization, ...restOfFields } = createSchoolDto;
    const createdAddress = await this.addressService.create(address);
    const createdOrganization =
      await this.organizationService.create(organization);

    const createSchool = {
      ...restOfFields,
      addressId: createdAddress._id,
      organizationId: createdOrganization._id,
    };

    const school = await this.schoolRepository.create({
      ...createSchool,
      updatedBy: 'Admin',
      effectiveAt: new Date(),
    });

    return {
      organization: createdOrganization,
      address: createdAddress,
      ...school.toObject(),
    };
  }

  async existByName(
    name: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.schoolRepository.exists(
      {
        name: {
          $regex: new RegExp(`^${name}$`),
          $options: 'i',
        },
      },
      { ...options, withDeleted: true },
    );
  }

  async findById(id: string): Promise<SchoolDoc | null> {
    const school = await this.schoolRepository.findOneById(id, { join: true });
    //FIXME - shift this exception outside it doesn't get detected
    if (!school) {
      throw new NotFoundException({
        statusCode: ENUM_SCHOOL_STATUS_CODE_ERROR.SCHOOL_NOT_FOUND_ERROR,
        message: 'school.error.notFound',
      });
    }
    return school;
  }

  async findAll() {
    return this.schoolRepository.findAll({}, { join: true });
  }

  async update(id: string, updateSchoolDto: SchoolUpdateDto) {
    const school = await this.findById(id);
    if (!school) {
      throw new NotFoundException({
        statusCode: ENUM_SCHOOL_STATUS_CODE_ERROR.SCHOOL_NOT_FOUND_ERROR,
        message: 'school.error.notFound',
      });
    }

    const { address, organization, ...restOfFields } = updateSchoolDto;

    const updateSchool = {
      ...restOfFields,
    };

    if (updateSchoolDto.details) {
      updateSchool.details = {
        ...school.details,
        ...updateSchoolDto.details,
      };
    }

    const updatedSchool = await this.schoolRepository.findByIdAndUpdate(
      school._id,
      updateSchool,
    );

    let updatedData: any = { ...updatedSchool };

    if (updateSchoolDto.address) {
      const updatedAddress = await this.addressService.update(
        school.addressId,
        address,
      );

      updatedData = { ...updatedData, address: updatedAddress };
    }

    if (updateSchoolDto.organization) {
      const updatedOrganization = await this.organizationService.update(
        school.organizationId,
        organization,
      );

      updatedData = { ...updatedData, organization: updatedOrganization };
    }

    return updatedData;
  }

  async softDelete(id: string): Promise<SchoolDoc | null> {
    return this.schoolRepository.findOneAndSoftDelete(id);
  }

  async delete(
    repository: SchoolDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SchoolDoc> {
    return this.schoolRepository.softDelete(repository, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.schoolRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.schoolRepository.deleteMany(find, options);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.schoolRepository.softDeleteMany(find, options);
  }
}

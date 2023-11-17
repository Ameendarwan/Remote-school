// organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from './repository/repositories/organization.repository';
import { OrganizationDoc } from './repository/entities/organization.entity';
import {
  IDatabaseExistOptions,
  IDatabaseManyOptions,
} from '@app/common/database/interfaces/database.interface';
import { ENUM_ORGANIZATION_STATUS_CODE_ERROR } from './constants/organization.status-code.constant';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDoc> {
    const { name } = createOrganizationDto;

    const organization = await this.organizationRepository.findOne({ name });

    if (!organization)
      return this.organizationRepository.create({
        ...createOrganizationDto,
        effectiveAt: new Date(),
        updatedBy: 'Admin',
      });

    return organization;

    // const organizationExist = await this.existByName(name);

    // if (organizationExist) {
    //   throw new ConflictException({
    //     statusCode: ENUM_SCHOOL_STATUS_CODE_ERROR.SCHOOL_ALREADY_EXIST_ERROR,
    //     message: 'organization.error.nameAlreadyExist',
    //   });
    // }
  }

  async findById(id: string): Promise<OrganizationDoc | null> {
    const organization = await this.organizationRepository.findOneById(id);

    if (!organization) {
      throw new NotFoundException({
        statusCode:
          ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_NOT_FOUND_ERROR,
        message: 'organization.error.notFound',
      });
    }

    return organization;
  }

  async findAll(): Promise<OrganizationDoc[]> {
    return this.organizationRepository.findAll({});
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationDoc | null> {
    try {
      const organization = await this.findById(id);

      if (updateOrganizationDto.details) {
        updateOrganizationDto.details = {
          ...organization.details,
          ...updateOrganizationDto.details,
        };
      }

      return this.organizationRepository.findByIdAndUpdate(
        id,
        updateOrganizationDto,
      );
    } catch (error) {
      throw new Error(`Failed to update organization: ${error.message}`);
    }
  }

  async delete(id: string): Promise<OrganizationDoc | null> {
    return this.organizationRepository.findOneAndSoftDelete(id);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.organizationRepository.deleteMany(find, options);
  }

  async softDelete(id: string): Promise<OrganizationDoc | null> {
    return this.organizationRepository.findOneAndSoftDelete(id);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.organizationRepository.softDeleteMany(find, options);
  }

  async existByName(
    name: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.organizationRepository.exists(
      {
        name: {
          $regex: new RegExp(`^${name}$`),
          $options: 'i',
        },
      },
      { ...options, withDeleted: true },
    );
  }
}

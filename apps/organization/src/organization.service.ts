// organization.service.ts
import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from './repository/repositories/organization.repository';
import { OrganizationDoc } from './repository/entities/organization.entity';
import { IDatabaseManyOptions } from '@app/common/database/interfaces/database.interface';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDoc> {
    const organization = this.organizationRepository.create({
      ...createOrganizationDto,
      effectiveAt: new Date(),
      updatedBy: 'Admin',
    });
    return organization;
  }

  async findById(id: string): Promise<OrganizationDoc | null> {
    return this.organizationRepository.findOne({ _id: id });
  }

  async findAll(): Promise<OrganizationDoc[]> {
    return this.organizationRepository.findAll({});
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationDoc | null> {
    return this.organizationRepository.findByIdAndUpdate(
      id,
      updateOrganizationDto,
    );
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
}

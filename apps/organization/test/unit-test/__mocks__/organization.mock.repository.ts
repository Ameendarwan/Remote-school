import { UpdateOrganizationDto } from 'apps/auth/src/organization/dto/update-organization.dto';
import { CreateOrganizationDto } from '../../../src/dto/create-organization.dto';

import { OrganizationEntity } from 'apps/auth/src/organization/repository/entities/organization.entity';
import {
  createMockOrganizationEntity,
  organizationEntityDoc,
  organizationId,
} from '../stubs/organization.stub';

export const mockAddrssRepository = {
  findAll: jest
    .fn()
    .mockResolvedValue([new OrganizationEntity(), new OrganizationEntity()]),
  findOneById: jest.fn().mockImplementation((id: string) => {
    const find = new organizationEntityDoc();
    find._id = id;

    return find;
  }),
  getTotal: jest.fn().mockResolvedValue(1),
  exists: jest.fn().mockResolvedValue(true),
  create: jest.fn().mockImplementation((dto: CreateOrganizationDto) => {
    const find = new organizationEntityDoc();

    find.name = dto.name;
    find.details = dto.details;

    find._id = organizationId;

    return find;
  }),
  findByIdAndUpdate: jest
    .fn()
    .mockImplementation((id: string, dto: UpdateOrganizationDto) => {
      const find = new organizationEntityDoc();

      find._id = organizationId;
      find.name = dto.name;
      return find;
    }),
  save: jest.fn().mockImplementation(() => {
    return createMockOrganizationEntity();
  }),
  softDelete: jest.fn().mockImplementation(() => {
    const find = new organizationEntityDoc();
    find._id = organizationId;

    return find;
  }),
};

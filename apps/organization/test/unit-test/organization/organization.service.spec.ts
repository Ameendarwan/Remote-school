import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationService } from 'apps/auth/src/organization/organization.service';

import { UpdateOrganizationDto } from 'apps/auth/src/organization/dto/update-organization.dto';
import {
  organizationEntityDoc,
  organizationId,
  organizationOptionalFields,
  fakeOrganizationDto,
} from '../stubs/organization.stub';
import { OrganizationRepository } from 'apps/auth/src/organization/repository/repositories/organization.repository';
import { mockAddrssRepository } from '../__mocks__/organization.mock.repository';
// export const organizationId = faker.string.uuid();
describe('OrganizationService', () => {
  let service: OrganizationService;
  let repository: OrganizationRepository;
  beforeEach(async () => {
    const moduleRefRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: OrganizationRepository,
          useValue: mockAddrssRepository,
        },
      ],
    }).compile();

    service = moduleRefRef.get<OrganizationService>(OrganizationService);
    repository = moduleRefRef.get<OrganizationRepository>(
      OrganizationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all organization', async () => {
      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result.length).toEqual(2);
    });
  });

  describe('findOneById', () => {
    it('should find organization by id', async () => {
      const result = await service.findById('id');

      expect(repository.findOneById).toHaveBeenCalled();
      expect(result).toBeInstanceOf(organizationEntityDoc);
      expect(result._id).toBe('id');
    });
  });

  describe('getTotal', () => {
    it('should get total number of organizations', async () => {
      const result = await service.getTotal();

      expect(repository.getTotal).toHaveBeenCalled();
      expect(typeof result).toBe('number');
      expect(result).toBe(1);
    });
  });

  describe('create', () => {
    it('should create new organization', async () => {
      const result = await service.create(fakeOrganizationDto);

      expect(repository.create).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith({
        ...fakeOrganizationDto,
        ...organizationOptionalFields,
        effectiveAt: expect.any(Date),
      });
      expect(result).toBeInstanceOf(organizationEntityDoc);
      expect(result._id).toBe(organizationId);
    });
  });

  describe('update', () => {
    it('should update organization name', async () => {
      const name = 'Lane J. Rhoades';

      const dto: UpdateOrganizationDto = {
        name,
      };

      const result = await service.update(organizationId, dto);

      expect(repository.findByIdAndUpdate).toHaveBeenCalled();
      expect(repository.findByIdAndUpdate).toHaveBeenCalledWith(
        organizationId,
        dto,
      );
      expect(result).toBeInstanceOf(organizationEntityDoc);
      expect(result._id).toBe(organizationId);
      expect(result.name).toBe(name);
    });
  });

  describe('delete', () => {
    it('should delete a organization', async () => {
      const result = await Service.softDelete(new organizationEntityDoc());

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBeInstanceOf(organizationEntityDoc);
      expect(result._id).toBe(organizationId);
    });
  });
});

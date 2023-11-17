import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { OrganizationService } from 'apps/organization/src/organization.service';

import { faker } from '@faker-js/faker';
import { OrganizationDoc } from 'apps/organization/src/repository/entities/organization.entity';

const ORGANIZATION_TO_CREATE = 25;

@Injectable()
export class MigrationOrganizationSeed {
  constructor(private readonly organizationService: OrganizationService) {}

  generateFakeOrganizations(count: number): Promise<OrganizationDoc>[] {
    const organizations: Promise<OrganizationDoc>[] = [];

    for (let i = 0; i < count; i++) {
      const name = faker.company.name();
      const details = {
        description: faker.company.catchPhrase(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
      };

      const organization: Promise<OrganizationDoc> =
        this.organizationService.create({ name, details });

      organizations.push(organization);
    }

    return organizations;
  }

  @Command({
    command: 'seed:organization',
    describe: 'seeds organization',
  })
  async seeds(): Promise<void> {
    try {
      const fakeOrganizations = this.generateFakeOrganizations(
        ORGANIZATION_TO_CREATE,
      );

      await Promise.all(fakeOrganizations);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:organization',
    describe: 'remove organizations',
  })
  async remove(): Promise<void> {
    try {
      await this.organizationService.softDeleteMany({});
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}

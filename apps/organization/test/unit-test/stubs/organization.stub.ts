import { faker } from '@faker-js/faker';
import {
  OrganizationDatabaseName,
  OrganizationSchema,
} from 'apps/organization/src/repository/entities/organization.entity';

import mongoose from 'mongoose';

export const fakeOrganizationDto = {
  name: faker.person.name(),
  organizationDetails: {
    detail1: faker.lorem.sentence(),
    detail2: faker.lorem.sentence(),
  },
};

export const organizationOptionalFields = {
  effectiveAt: faker.date.anytime(),
  updatedBy: 'Admin',
};

export const organizationId = faker.string.uuid();
export const organizationEmail = faker.internet.email();
export const organizationEntityDoc = new mongoose.Mongoose().model(
  OrganizationDatabaseName,
  OrganizationSchema,
);

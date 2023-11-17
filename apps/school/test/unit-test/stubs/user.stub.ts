import {
  UserDatabaseName,
  UserSchema,
} from '@app/common/entities/auth/user.entity';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from 'apps/auth/src/users/dto/create-user.dto';

import mongoose from 'mongoose';

export const userId = faker.string.uuid();
export const userEmail = faker.internet.email();
export const userEntityDoc = new mongoose.Mongoose().model(
  UserDatabaseName,
  UserSchema,
);

export const NON_EXISTENT_EMAIL = 'nonexistent@example.com';

export const fakerUserDto: CreateUserDto = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  middleName: faker.person.middleName(),
  birthDate: faker.date.past(),
  gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
  imageUrl: faker.image.avatar(),
  email: faker.internet.email(),
  primaryPhone: faker.phone.number(),
  secondaryPhone: faker.phone.number(),
  userDetails: { customField: faker.word.adjective() },
};

export const userOptionalFields = {
  effectiveAt: faker.date.anytime(),
  updatedBy: 'Admin',
};

export const createMockUserEntity = (email?: boolean, role?) => {
  const find = new userEntityDoc();
  find._id = userId;
  if (email) {
    find.email = userEmail;
  }
  if (role) {
    find.role = role;
  }
  return find;
};

export const createMockForFindByIdAndUpdate = (id: string, role: string) => {
  const find = new userEntityDoc();
  find._id = userId;
  find.role = role;
  return find;
};

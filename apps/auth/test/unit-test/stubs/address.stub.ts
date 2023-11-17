import { faker } from '@faker-js/faker';
import {
  AddressDatabaseName,
  AddressSchema,
} from '@app/common/entities/auth/address.entity';
import mongoose from 'mongoose';

export const fakeAddressDto = {
  street: faker.location.street(),
  street1: faker.location.secondaryAddress(),
  council: faker.location.city(),
  town: faker.location.city(),
  tehsil: faker.location.county(),
  district: faker.location.county(),
  county: faker.location.county(),
  state: faker.location.state(),
  country: faker.location.country(),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  addressDetails: {
    comments: faker.lorem.sentence(),
  },
};

export const fakeOrganizationDto = {
  name: faker.company.name(),
  details: {
    comments: faker.lorem.sentence(),
  },
};

export const addressId = faker.string.uuid();
export const addressEmail = faker.internet.email();
export const addressEntityDoc = new mongoose.Mongoose().model(
  AddressDatabaseName,
  AddressSchema,
);

export const createdAddressMock = {
  ...fakeAddressDto,
  _id: addressId,
};

export const createMockAddressEntity = () => {
  const find = new addressEntityDoc();

  find.street = fakeAddressDto.street;
  find.street1 = fakeAddressDto.street1;
  find.council = fakeAddressDto.council;
  find.town = fakeAddressDto.town;
  find.tehsil = fakeAddressDto.tehsil;
  find.district = fakeAddressDto.district;
  find.county = fakeAddressDto.county;
  find.state = fakeAddressDto.state;
  find.country = fakeAddressDto.country;
  find.latitude = fakeAddressDto.latitude;
  find.longitude = fakeAddressDto.longitude;
  find.addressDetails = fakeAddressDto.addressDetails;

  find._id = addressId;

  return find;
};

export const createMockForFindByIdAndUpdate = (
  id: string,
  latitude: number,
  longitude: number,
) => {
  const find = new addressEntityDoc();
  find._id = addressId;
  find.latitude = latitude;
  find.longitude = longitude;
  return find;
};

import { faker } from '@faker-js/faker';

export const fakeSchoolDto = {
  name: faker.company.name(),
  status: faker.helpers.arrayElement(['Active', 'Inactive']),
  offline: faker.helpers.arrayElement([0, 1]),
  started: faker.date.past(),
  electricity: faker.lorem.word(),
  internet: faker.lorem.word(),
  schoolType: faker.lorem.word(),
  estimatedHousehold: faker.number.int(),
  spaceType: faker.lorem.word(),
  nearestSchool: faker.lorem.word(),
  model: faker.lorem.word(),
  // organizationId: faker.string.uuid(),
  // addressId: faker.string.uuid(),
  details: {
    instructions: faker.lorem.word(),
    workLifeBalance: faker.lorem.word(),
  },
};

// export const createdAddressMock = {
//   ...fakeAddressDto,
//   _id: addressId,
// };

// export const createMockAddressEntity = () => {
//   const find = new addressEntityDoc();

//   find.street = fakeAddressDto.street;
//   find.street1 = fakeAddressDto.street1;
//   find.council = fakeAddressDto.council;
//   find.town = fakeAddressDto.town;
//   find.tehsil = fakeAddressDto.tehsil;
//   find.district = fakeAddressDto.district;
//   find.county = fakeAddressDto.county;
//   find.state = fakeAddressDto.state;
//   find.country = fakeAddressDto.country;
//   find.latitude = fakeAddressDto.latitude;
//   find.longitude = fakeAddressDto.longitude;
//   find.addressDetails = fakeAddressDto.addressDetails;

//   find._id = addressId;

//   return find;
// };

// export const createMockForFindByIdAndUpdate = (
//   id: string,
//   latitude: number,
//   longitude: number,
// ) => {
//   const find = new addressEntityDoc();
//   find._id = addressId;
//   find.latitude = latitude;
//   find.longitude = longitude;
//   return find;
// };

// import { Command } from 'nestjs-command';
// import { Injectable } from '@nestjs/common';

// import { faker } from '@faker-js/faker';
// import { AddressService } from '@app/common/modules/address/address.service';
// import { OrganizationService } from 'apps/organization/src/organization.service';
// import { SchoolDoc } from 'apps/school/src/repository/entities/school.entity';
// import { SchoolService } from 'apps/school/src/school.service';
// import { OrganizationDoc } from 'apps/organization/src/repository/entities/organization.entity';
// import { AddressDoc } from '@app/common/entities/auth';

// const SCHOOL_TO_CREATE = 25;

// @Injectable()
// export class MigrationSchoolSeed {
//   constructor(
//     private readonly schoolService: SchoolService,
//     private readonly organizationService: OrganizationService,
//     private readonly addressService: AddressService,
//   ) {}

//   generateFakeSchools(
//     count: number,
//     organizations: OrganizationDoc[],
//     addresses: AddressDoc[],
//   ) {
//     const schools: Promise<SchoolDoc>[] = [];

//     for (let i = 0; i < count; i++) {
//       const fakeSchoolDto = {
//         name: faker.company.name(),
//         status: faker.helpers.arrayElement(['Active', 'Inactive']),
//         offline: faker.number.int({ min: 0, max: 1 }),
//         model: faker.helpers.arrayElement(['Public', 'Private']),
//         started: faker.date.past(),
//         electricity: faker.helpers.arrayElement(['Yes', 'No']),
//         internet: faker.helpers.arrayElement(['High-Speed', 'None']),
//         schoolType: faker.helpers.arrayElement(['Primary', 'Secondary']),
//         estimatedHousehold: faker.number.int({ min: 1, max: 100 }),
//         spaceType: faker.helpers.arrayElement(['Urban', 'Rural']),
//         nearestSchool: faker.company.name(),
//         organizationId: organizations[i]._id,
//         addressId: addresses[i]._id,

//         details: {
//           someDetail: faker.word.sample(),
//           anotherDetail: faker.word.sample(),
//         },
//       };

//       const school: Promise<SchoolDoc> =
//         this.schoolService.create(fakeSchoolDto);

//       schools.push(school);
//     }

//     return schools;
//   }

//   @Command({
//     command: 'seed:school',
//     describe: 'seeds school',
//   })
//   async seeds(): Promise<void> {
//     try {
//       const organizations = await this.organizationService.findAll();
//       const addresses = await this.addressService.findAll();
//       const fakeSchools = this.generateFakeSchools(
//         SCHOOL_TO_CREATE,
//         organizations,
//         addresses,
//       );

//       await Promise.all(fakeSchools);
//     } catch (err: any) {
//       throw new Error(err.message);
//     }

//     return;
//   }

//   @Command({
//     command: 'remove:school',
//     describe: 'remove schools',
//   })
//   async remove(): Promise<void> {
//     try {
//       await this.schoolService.softDeleteMany({});
//     } catch (err: any) {
//       throw new Error(err.message);
//     }

//     return;
//   }
// }

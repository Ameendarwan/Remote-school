import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { AddressDoc } from '@app/common/entities/auth';
import { AddressService } from '@app/common/modules/address/address.service';

const ADDRESS_TO_CREATE = 25;

@Injectable()
export class MigrationAddressSeed {
  constructor(private readonly addressService: AddressService) {}

  generateFakeAddresss(count: number): Promise<AddressDoc>[] {
    const addresss: Promise<AddressDoc>[] = [];

    for (let i = 0; i < count; i++) {
      const fakeAddressDto = {
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

      const address: Promise<AddressDoc> =
        this.addressService.create(fakeAddressDto);

      addresss.push(address);
    }

    return addresss;
  }

  @Command({
    command: 'seed:address',
    describe: 'seeds address',
  })
  async seeds(): Promise<void> {
    try {
      const fakeAddresss = this.generateFakeAddresss(ADDRESS_TO_CREATE);

      await Promise.all(fakeAddresss);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:address',
    describe: 'remove addresss',
  })
  async remove(): Promise<void> {
    try {
      await this.addressService.softDeleteMany({});
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}

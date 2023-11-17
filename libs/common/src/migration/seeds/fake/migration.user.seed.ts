import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { AddressDoc, UserDoc } from '@app/common/entities/auth';
import { AddressService } from '@app/common/modules/address/address.service';
import { faker } from '@faker-js/faker';
import { UserRole } from 'apps/auth/src/users/dto/create-user-no-role.dto';
import { SignupUserDto } from 'apps/auth/src/users/dto/user.sign-up.dto';
import { UserService } from 'apps/auth/src/users/users.service';

const USER_TO_CREATE = 25;

@Injectable()
export class MigrationUserSeed {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  generateFakeUsers(
    count: number,
    addresses: AddressDoc[],
  ): Promise<UserDoc>[] {
    const users: Promise<UserDoc>[] = [];

    for (let i = 0; i < count; i++) {
      const fakerUserDto: SignupUserDto = {
        username: faker.internet.userName(),
        password: 'mysweetpassword1969',
        role: faker.helpers.arrayElement([UserRole.Teacher, UserRole.Student]),
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
        addressId: addresses[i]._id,
      };

      const user: Promise<UserDoc> = this.userService.create(fakerUserDto);

      users.push(user);
    }

    return users;
  }

  @Command({
    command: 'seed:user',
    describe: 'seeds user',
  })
  async seeds(): Promise<void> {
    try {
      const addresses = await this.addressService.findAll();
      const fakeUsers = this.generateFakeUsers(USER_TO_CREATE, addresses);

      await Promise.all(fakeUsers);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:user',
    describe: 'remove users',
  })
  async remove(): Promise<void> {
    try {
      await this.userService.softDeleteMany({});
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}

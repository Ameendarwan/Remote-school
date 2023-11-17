import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { UserDoc } from '@app/common/entities/auth';
import { TeacherDoc } from 'apps/auth/src/teacher/repository/entities/teacher.entity';
import { TeacherService } from 'apps/auth/src/teacher/teacher.service';
import { UserService } from 'apps/auth/src/users/users.service';

const TEACHER_TO_CREATE = 25;

@Injectable()
export class MigrationTeacherSeed {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly userService: UserService,
  ) {}

  generateFakeTeachers(count: number, users: UserDoc[]) {
    const teachers: Promise<TeacherDoc>[] = [];

    for (let i = 0; i < count; i++) {
      const fakeTeacherDto = {
        userId: users[i]._id,
        certifications: {
          certification1: faker.lorem.words(3),
          certification2: faker.lorem.words(3),
        },
        education: {
          university: faker.company.name(),
          degree: faker.lorem.words(2),
          startDate: faker.date.past(),
          endDate: faker.date.past(),
          country: faker.location.country(),
          city: faker.location.city(),
        },
        hiredOn: faker.date.past(),
        teacherDetails: {
          detail1: faker.lorem.sentence(),
          detail2: faker.lorem.sentence(),
        },
        cnic: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        highestQualification: faker.lorem.words(2),
        hasTrainingExperience: faker.datatype.boolean(),
        experienceYears: parseInt(
          faker.number.int({ min: 1, max: 99 }).toString(),
          10,
        ),
        hasTakmilEducation: faker.datatype.boolean(),
        isResident: faker.datatype.boolean(),
      };

      const teacher: Promise<TeacherDoc> =
        this.teacherService.create(fakeTeacherDto);

      teachers.push(teacher);
    }

    return teachers;
  }

  @Command({
    command: 'seed:teacher',
    describe: 'seeds teacher',
  })
  async seeds(): Promise<void> {
    try {
      const users = await this.userService.findAll();
      const fakeTeachers = this.generateFakeTeachers(TEACHER_TO_CREATE, users);

      await Promise.all(fakeTeachers);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:teacher',
    describe: 'remove teachers',
  })
  async remove(): Promise<void> {
    try {
      await this.teacherService.softDeleteMany({});
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}

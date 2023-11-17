import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { UserDoc } from '@app/common/entities/auth';
import { StudentDoc } from 'apps/auth/src/student/repository/entities/student.entity';
import { StudentService } from 'apps/auth/src/student/student.service';
import { UserService } from 'apps/auth/src/users/users.service';

const TEACHER_TO_CREATE = 25;

@Injectable()
export class MigrationStudentSeed {
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}

  generateFakeStudents(count: number, users: UserDoc[]) {
    const students: Promise<StudentDoc>[] = [];

    for (let i = 0; i < count; i++) {
      const fakeStudentDto = {
        userId: users[i]._id,
        specialNeeds: faker.lorem.words(3),
        enrolledOn: faker.date.past(),
        religion: faker.lorem.words(2),
        studentDetails: {
          detail1: faker.lorem.sentence(),
          detail2: faker.lorem.sentence(),
        },
      };

      const student: Promise<StudentDoc> =
        this.studentService.create(fakeStudentDto);

      students.push(student);
    }

    return students;
  }

  @Command({
    command: 'seed:student',
    describe: 'seeds student',
  })
  async seeds(): Promise<void> {
    try {
      const users = await this.userService.findAll();
      const fakeStudents = this.generateFakeStudents(TEACHER_TO_CREATE, users);

      await Promise.all(fakeStudents);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:student',
    describe: 'remove students',
  })
  async remove(): Promise<void> {
    try {
      await this.studentService.softDeleteMany({});
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}

import { faker } from '@faker-js/faker';
import { CreateStudentLinkedDto } from 'apps/auth/src/student/dto/create-student-linked-with-user.dto';
import { CreateStudentDto } from 'apps/auth/src/student/dto/create-student.dto';
import {
  StudentDatabaseName,
  StudentSchema,
} from 'apps/auth/src/student/repository/entities/student.entity';
import mongoose from 'mongoose';

export const studentId = faker.string.uuid();
export const studentEmail = faker.internet.email();
export const studentEntityDoc = new mongoose.Mongoose().model(
  StudentDatabaseName,
  StudentSchema,
);

export const fakeStudentDto: CreateStudentDto = {
  specialNeeds: faker.lorem.words(3),
  enrolledOn: faker.date.past(),
  religion: faker.lorem.words(2),
  studentDetails: {
    instructions: faker.lorem.sentence(),
    clearForWork: faker.lorem.sentence(),
  },
};

// export const fakeRegisterStudentDto: RegisterStudentDto = {
//   ...fakerUserDto,
//   ...fakeStudentDto,
//   ...fakeAddressDto,
// };

export const studentOptionalFields = {
  effectiveAt: faker.date.anytime(),
  updatedBy: 'Admin',
};

export const createdStudentMock = {
  ...fakeStudentDto,
  ...studentOptionalFields,
  _id: studentId,
};

export const createMockStudentEntity = () => {
  return createdStudentMock;
};

export const createMockForStudentFindByIdAndUpdate = (
  id: string,
  religion: string,
) => {
  if (id !== studentId) return null;
  const createdStudent = { ...createdStudentMock };
  createdStudent._id = id;
  createdStudent.religion = religion;

  return createdStudent;
};

export const createMockForStudentLinked = (userId: string) => {
  const student: CreateStudentLinkedDto = {
    ...createdStudentMock,
    userId,
  };

  return student;
};

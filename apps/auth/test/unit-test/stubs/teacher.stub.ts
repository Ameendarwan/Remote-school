import { faker } from '@faker-js/faker';
import { CreateTeacherLinkedDto } from 'apps/auth/src/teacher/dto/create-teacher-linked-with-user.dto';
import { CreateTeacherDto } from 'apps/auth/src/teacher/dto/create-teacher.dto';
import {
  TeacherDatabaseName,
  TeacherSchema,
} from 'apps/auth/src/teacher/repository/entities/teacher.entity';
import mongoose from 'mongoose';

export const teacherId = faker.string.uuid();
export const teacherEmail = faker.internet.email();
export const teacherEntityDoc = new mongoose.Mongoose().model(
  TeacherDatabaseName,
  TeacherSchema,
);

export const fakeTeacherDto: CreateTeacherDto = {
  certifications: {
    certification1: faker.lorem.words(3),
    certification2: faker.lorem.words(3),
  },
  education: {
    university: faker.company.name(),
    degree: faker.lorem.words(2),
    startDate: faker.date.past().toISOString(),
    endDate: faker.date.past().toISOString(),
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

// export const fakeRegisterTeacherDto: RegisterTeacherDto = {
//   ...fakerUserDto,
//   ...fakeTeacherDto,
//   ...fakeAddressDto,
// };

export const teacherOptionalFields = {
  effectiveAt: faker.date.anytime(),
  updatedBy: 'Admin',
};

export const createdTeacherMock = {
  ...fakeTeacherDto,
  ...teacherOptionalFields,
  _id: teacherId,
};

export const createMockTeacherEntity = () => {
  return createdTeacherMock;
};

export const createMockForTeacherFindByIdAndUpdate = (
  id: string,
  isResident: boolean,
) => {
  if (id !== teacherId) return null;
  const createdTeacher = { ...createdTeacherMock };
  createdTeacher._id = id;
  createdTeacher.isResident = isResident;

  return createdTeacher;
};

export const createMockForTeacherLinked = (userId: string) => {
  const teacher: CreateTeacherLinkedDto = {
    ...createdTeacherMock,
    userId,
  };

  return teacher;
};

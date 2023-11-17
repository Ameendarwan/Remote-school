import { faker } from '@faker-js/faker';

export const GradeDocParamsId = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

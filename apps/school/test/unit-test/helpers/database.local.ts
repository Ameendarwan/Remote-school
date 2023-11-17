import mongoose from 'mongoose';

export const testEnvironment = {
  database: {
    uri: 'mongodb://localhost:27017/test_database',
  },
};

export async function setupTestDatabase() {
  const uri = testEnvironment.database.uri;
  await mongoose.connect(uri);
}

export async function teardownTestDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

// You can call these functions in your test suite's beforeAll and afterAll or beforeEach and afterEach hooks.

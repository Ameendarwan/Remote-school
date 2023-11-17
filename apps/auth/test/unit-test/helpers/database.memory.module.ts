import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongo: MongoMemoryServer;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongo = await MongoMemoryServer.create();
        const mongoUri = mongo.getUri();
        console.log(
          '🚀 ~ file: database.memory.module.ts:13 ~ useFactory: ~ mongoUri:',
          mongoUri,
        );
        return {
          uri: mongoUri,
          // uri: 'mongodb://localhost:27017/test_database',
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        };
      },
    }),
  ],
})
export class DatabaseTestMongooseModule {}

export const killDatabaseConnection = async () => {
  if (mongo) await mongo.stop();
};

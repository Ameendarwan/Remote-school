import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IDatabaseOptionsService } from '../interfaces/database.options-service.interface';
import { ENUM_APP_ENVIRONMENT } from '@app/common/constants';

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

@Injectable()
export class DatabaseOptionsService implements IDatabaseOptionsService {
  constructor(private readonly configService: ConfigService) {}

  async getMongoMemoryDatabaseUri() {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    console.log('MongoDB in-memory server URI:', mongoUri);
    return mongoUri;
  }

  async getDatabaseHost() {
    if (process.env.APP_ENV === ENUM_APP_ENVIRONMENT.TESTING) {
      const uri = await this.getMongoMemoryDatabaseUri();
      return uri;
    } else {
      return null;
    }
  }

  getDatabaseName = () => {
    if (process.env.APP_ENV === ENUM_APP_ENVIRONMENT.TESTING) {
      return 'takmil_test'; // Use a different name for the test database
    } else {
      return null;
    }
  };

  async createOptions(): Promise<MongooseModuleOptions> {
    const env = this.configService.get<string>('app.env');
    const host = this.configService.get<string>('database.host');
    const database = this.configService.get<string>('database.name');
    const debug = this.configService.get<boolean>('database.debug');

    const options = this.configService.get<string>('database.options')
      ? `?${this.configService.get<string>('database.options')}`
      : '';

    let uri = `${host}`;

    if (env === ENUM_APP_ENVIRONMENT.TESTING) {
      const memoryDbHost = await this.getDatabaseHost();
      const testingDBName = this.getDatabaseName();

      if (memoryDbHost) {
        uri = `${memoryDbHost}${testingDBName}${options}`;
      }
    } else if (database) {
      uri = `${uri}/${database}${options}`;
    }

    if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      mongoose.set('debug', debug);
    }

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      serverSelectionTimeoutMS: 5000,
      autoCreate: true,
      // useMongoClient: true,
    };
    console.log(
      '🚀 ~ file: database.options.service.ts:38 ~ DatabaseOptionsService ~ createOptions ~ mongooseOptions:',
      mongooseOptions,
    );

    return mongooseOptions;
  }
}

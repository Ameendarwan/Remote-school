import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AttendenceEntity,
  AttendenceSchema,
} from './entities/attendence.entity';
import { AttendenceRepository } from './repositories/attendance.repository';

@Module({
  providers: [AttendenceRepository],
  exports: [AttendenceRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: AttendenceEntity.name,
          schema: AttendenceSchema,
        },
      ],
      // DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class AttendenceRepositoryModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassSubjectsEntity,
  ClassSubjectsSchema,
} from './entities/class-subject.entity';
import { ClassSubjectsRepository } from './repositories/class-subjects.repository';

@Module({
  providers: [ClassSubjectsRepository],
  exports: [ClassSubjectsRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ClassSubjectsEntity.name,
          schema: ClassSubjectsSchema,
        },
      ],
      // DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ClassSubjectsRepositoryModule {}

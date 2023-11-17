import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolEntity, SchoolSchema } from './entities/school.entity';
import { SchoolRepository } from './repositories/school.repository';

@Module({
  providers: [SchoolRepository],
  exports: [SchoolRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SchoolEntity.name,
          schema: SchoolSchema,
        },
      ],
      // DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class SchoolRepositoryModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesEntity, ClassesSchema } from './entities/class.entity';
import { ClassesRepository } from './repositories/classes.repository';

@Module({
  providers: [ClassesRepository],
  exports: [ClassesRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ClassesEntity.name,
          schema: ClassesSchema,
        },
      ],
      // DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ClassesRepositoryModule {}

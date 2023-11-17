import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectEntity, SubjectSchema } from './entities/subject.entity';
import { SubjectRepository } from './repositories/subject.repository';

@Module({
  providers: [SubjectRepository],
  exports: [SubjectRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SubjectEntity.name,
          schema: SubjectSchema,
        },
      ],
      // DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class SubjectRepositoryModule {}

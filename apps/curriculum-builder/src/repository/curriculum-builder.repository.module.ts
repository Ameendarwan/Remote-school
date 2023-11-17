import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CurriculumBuilderEntity,
  CurriculumBuilderSchema,
} from './entities/curriculum-builder.entity';
import { CurriculumBuilderRepository } from './repositories/curriculum-builder.repository';

@Module({
  providers: [CurriculumBuilderRepository],
  exports: [CurriculumBuilderRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: CurriculumBuilderEntity.name,
        schema: CurriculumBuilderSchema,
      },
    ]),
  ],
})
export class CurriculumBuilderRepositoryModule {}

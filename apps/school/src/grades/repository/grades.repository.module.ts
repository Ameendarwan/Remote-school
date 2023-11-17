import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeEntity, GradeSchema } from './entities/grade.entity';
import { GradeRepository } from './repositories/grade.repository';

@Module({
  providers: [GradeRepository],
  exports: [GradeRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: GradeEntity.name,
          schema: GradeSchema,
        },
      ],
      // DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class GradeRepositoryModule {}

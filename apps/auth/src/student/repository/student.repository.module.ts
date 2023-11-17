import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentEntity, StudentSchema } from './entities/student.entity';
import { StudentRepository } from './repositories/student.repository';

@Module({
  providers: [StudentRepository],
  exports: [StudentRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: StudentEntity.name,
        schema: StudentSchema,
      },
    ]),
  ],
})
export class StudentRepositoryModule {}

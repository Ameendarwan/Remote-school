import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherEntity, TeacherSchema } from './entities/teacher.entity';
import { TeacherRepository } from './repositories/teacher.repository';

@Module({
  providers: [TeacherRepository],
  exports: [TeacherRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: TeacherEntity.name,
        schema: TeacherSchema,
      },
    ]),
  ],
})
export class TeacherRepositoryModule {}

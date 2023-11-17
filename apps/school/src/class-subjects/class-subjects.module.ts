import { Module } from '@nestjs/common';
import { ClassSubjectsService } from './class-subjects.service';
import { ClassSubjectsController } from './class-subjects.controller';
import { ClassSubjectsRepositoryModule } from './repository/class-subject.repository.module';

@Module({
  imports: [ClassSubjectsRepositoryModule],
  controllers: [ClassSubjectsController],
  providers: [ClassSubjectsService],
})
export class ClassSubjectsModule {}

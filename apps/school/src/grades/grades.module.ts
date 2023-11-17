import { Module } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { GradeService } from './grades.service';
import { GradeRepositoryModule } from './repository/grades.repository.module';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [GradeRepositoryModule, ClassesModule],
  controllers: [GradesController],
  providers: [GradeService],
})
export class GradesModule {}

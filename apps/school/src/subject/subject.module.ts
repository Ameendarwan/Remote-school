import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

import { SubjectRepositoryModule } from './repository/subject.repository.module';

@Module({
  imports: [SubjectRepositoryModule],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}

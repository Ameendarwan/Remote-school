import { Module } from '@nestjs/common';
import { AssessmentLogService } from './assessment-log.service';
import { AssessmentLogController } from './assessment-log.controller';
import { AssessmentLogRepositoryModule } from './repository/assessment-log.repository.module';

@Module({
  imports: [AssessmentLogRepositoryModule],
  controllers: [AssessmentLogController],
  providers: [AssessmentLogService],
})
export class AssessmentLogModule {}

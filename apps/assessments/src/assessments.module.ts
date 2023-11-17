import { Module } from '@nestjs/common';
import { AssessmentsController } from './assessments.controller';
import { QuestionLogModule } from './question-log/question-log.module';
import { AssessmentLogModule } from './assessment-log/assessment-log.module';
import { QuestionsModule } from './questions/questions.module';
import { AssessmentsRepositoryModule } from './repository/assessments.repository.module';
import { AssessmentsService } from './assessments.service';

@Module({
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  imports: [
    QuestionLogModule,
    AssessmentLogModule,
    QuestionsModule,
    AssessmentsRepositoryModule,
  ],
})
export class AssessmentsModule {}

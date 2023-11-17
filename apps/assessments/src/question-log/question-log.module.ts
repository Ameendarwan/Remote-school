import { Module } from '@nestjs/common';
import { QuestionLogService } from './question-log.service';
import { QuestionLogController } from './question-log.controller';
import { QuestionLogRepositoryModule } from './repository/question-log.repository.module';

@Module({
  imports: [QuestionLogRepositoryModule],
  controllers: [QuestionLogController],
  providers: [QuestionLogService],
})
export class QuestionLogModule {}

import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonsRepositoryModule } from './repository/lessons.repository.module';

@Module({
  imports: [LessonsRepositoryModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}

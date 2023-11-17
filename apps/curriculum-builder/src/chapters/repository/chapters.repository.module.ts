import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersRepository } from './repositories/chapters.repository';
import { ChaptersEntity, ChaptersSchema } from './entities/chapter.entity';

@Module({
  providers: [ChaptersRepository],
  exports: [ChaptersRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: ChaptersEntity.name,
        schema: ChaptersSchema,
      },
    ]),
  ],
})
export class ChaptersRepositoryModule {}

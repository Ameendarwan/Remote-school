import { DatabaseMongoUUIDRepositoryAbstract } from '@app/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from '@app/common/database/decorators/database.decorator';
import { Injectable } from '@nestjs/common/decorators';
import { Model } from 'mongoose';
import { ChaptersDoc, ChaptersEntity } from '../entities/chapter.entity';

@Injectable()
export class ChaptersRepository extends DatabaseMongoUUIDRepositoryAbstract<
  ChaptersEntity,
  ChaptersDoc
> {
  constructor(
    @DatabaseModel(ChaptersEntity.name)
    private readonly chapterModel: Model<ChaptersEntity>,
  ) {
    super(chapterModel);
  }
}

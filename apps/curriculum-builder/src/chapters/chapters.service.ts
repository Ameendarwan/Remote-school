import { Injectable } from '@nestjs/common';
import { CreateChaptersDto } from './dto/create-chapter.dto';
import { UpdateChaptersDto } from './dto/update-chapter.dto';
import { ChaptersDoc } from './repository/entities/chapter.entity';
import { ChaptersRepository } from './repository/repositories/chapters.repository';
import {
  IDatabaseSaveOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from '@app/common/database/interfaces/database.interface';

@Injectable()
export class ChaptersService {
  constructor(private readonly chaptersRepository: ChaptersRepository) {}

  async create(createChaptersDto: CreateChaptersDto): Promise<ChaptersDoc> {
    const chapter = this.chaptersRepository.create(createChaptersDto);
    return chapter;
  }

  async findById(id: string): Promise<ChaptersDoc | null> {
    return this.chaptersRepository.findOne({ _id: id });
  }

  async findAll(): Promise<ChaptersDoc[]> {
    return this.chaptersRepository.findAll({});
  }

  async findAllBySubject(subjectId: string): Promise<ChaptersDoc[]> {
    return this.chaptersRepository.findAll({ subjectId });
  }

  async update(
    chapter: ChaptersDoc,
    updateChatperDto: UpdateChaptersDto,
  ): Promise<ChaptersDoc | null> {
    try {
      if (updateChatperDto.details) {
        updateChatperDto.details = {
          ...chapter.details,
          ...updateChatperDto.details,
        };
      }

      return this.chaptersRepository.findByIdAndUpdate(
        chapter._id,
        updateChatperDto,
      );
    } catch (error) {
      throw new Error(`Failed to update chapters: ${error.message}`);
    }
  }

  async delete(
    repository: ChaptersDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ChaptersDoc> {
    return this.chaptersRepository.softDelete(repository, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.chaptersRepository.getTotal(find, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.chaptersRepository.deleteMany(find, options);
  }

  async softDelete(id: string): Promise<ChaptersDoc | null> {
    return this.chaptersRepository.findOneAndSoftDelete(id);
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.chaptersRepository.softDeleteMany(find, options);
  }
}

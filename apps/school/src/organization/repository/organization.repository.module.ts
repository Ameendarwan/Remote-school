import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrganizationEntity,
  OrganizationSchema,
} from './entities/organization.entity';
import { OrganizationRepository } from './repositories/organization.repository';

@Module({
  providers: [OrganizationRepository],
  exports: [OrganizationRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: OrganizationEntity.name,
          schema: OrganizationSchema,
        },
      ],
      // DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class OrganizationRepositoryModule {}

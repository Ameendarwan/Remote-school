import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';

import { OrganizationRepositoryModule } from './repository/organization.repository.module';

@Module({
  imports: [OrganizationRepositoryModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}

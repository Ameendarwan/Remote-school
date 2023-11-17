import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';

import { TeacherRepositoryModule } from './repository/teacher.repository.module';
import { HelperModule } from '@app/common/helper/helper.module';
import { UsersModule } from '../users/users.module';
import { AddressModule } from '../../../../libs/common/src/modules/address/address.module';

@Module({
  imports: [UsersModule, AddressModule, HelperModule, TeacherRepositoryModule],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}

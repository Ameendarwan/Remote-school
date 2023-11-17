import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentRepositoryModule } from './repository/student.repository.module';

import { HelperModule } from '@app/common/helper/helper.module';
import { UsersModule } from '../users/users.module';
import { AddressModule } from '../../../../libs/common/src/modules/address/address.module';
@Module({
  imports: [UsersModule, AddressModule, StudentRepositoryModule, HelperModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}

import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepositoryModule } from './repository/user.repository.module';
import { AuthenticationModule } from '@app/common/auth/auth.module';

@Module({
  imports: [UserRepositoryModule, AuthenticationModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}

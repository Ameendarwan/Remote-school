import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserEntity,
  UserSchema,
} from '../../../../../libs/common/src/entities/auth/user.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class UserRepositoryModule {}

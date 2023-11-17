import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressRepository } from './repositories/address.repository';
import { AddressEntity, AddressSchema } from '@app/common/entities/auth';

@Module({
  providers: [AddressRepository],
  exports: [AddressRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: AddressEntity.name,
        schema: AddressSchema,
      },
    ]),
  ],
})
export class AddressRepositoryModule {}

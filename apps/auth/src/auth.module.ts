import { CommonModule } from '@app/common/common.module';
import { DatabaseOptionsModule } from '@app/common/database/database.options.module';
import { DatabaseOptionsService } from '@app/common/database/services/database.options.service';
import { LoggerModule } from '@app/common/logger';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressModule } from '../../../libs/common/src/modules/address/address.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import configs from './configs';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      // validationSchema: Joi.object({
      //   MONGODB_URI: Joi.string().required(),
      //   JWT_SECRET: Joi.string().required(),
      //   JWT_EXPIRATION: Joi.string().required(),
      //   HTTP_PORT: Joi.number().required(),
      //   TCP_PORT: Joi.number().required(),
      // })
    }),
    MongooseModule.forRootAsync({
      // connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionsModule],
      inject: [DatabaseOptionsService],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    UsersModule,
    CommonModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('helper.jwt.secretKey'),
        signOptions: {
          expiresIn: configService.get<string>('helper.jwt.expirationTime'),
        },
      }),
    }),
    TeacherModule,
    StudentModule,
    AddressModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}

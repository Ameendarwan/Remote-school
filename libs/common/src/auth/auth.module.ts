import { Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from './guards/jwt-access/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from './guards/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthenticationService } from './services/auth.service';

@Module({
  providers: [
    AuthenticationService,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
  ],
  exports: [AuthenticationService],
  controllers: [],
  imports: [],
})
export class AuthenticationModule {}

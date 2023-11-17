import { Injectable } from '@nestjs/common/decorators';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication || request?.Authentication,
      ]),
      secretOrKey: 'whatever123' || configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }) {
    try {
      return this.userService.getUser({ _id: userId });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

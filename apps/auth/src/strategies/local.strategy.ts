import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'usernameOrEmail', passwordField: 'password' });
  }

  //FIXME - quick hack add proper authentication later
  async validate(usernameOrEmail: string, password: string) {
    try {
      return await this.userService.verifyUser(usernameOrEmail, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

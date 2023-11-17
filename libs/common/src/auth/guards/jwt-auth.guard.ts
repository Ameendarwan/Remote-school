import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '../../dto';
import { AUTH_SERVICE } from '@app/common';

export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwtCookie = context.switchToHttp().getRequest().cookies
      ?.Authentication;
    if (!jwtCookie) return false;

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwtCookie,
      })
      .pipe(
        tap((user) => {
          context.switchToHttp().getRequest().user = user;
        }),
        map(() => true),
      );
  }
}

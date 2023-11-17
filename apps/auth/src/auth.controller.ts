import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { UserDoc } from '../../../libs/common/src/entities/auth/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDoc,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);

    //FIXME - temporary rsponse message
    response.send({ user, statusCode: 200, message: 'Login successful.' });
  }

  // @Post('register')
  // async registerNewUser(@Body() registerNewUserDto: RegisterNewUserDto) {
  //   return await this.authService.register(registerNewUserDto);
  // }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}

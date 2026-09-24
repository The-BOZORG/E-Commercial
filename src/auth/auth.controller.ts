import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import type { Response, Request } from 'express';

import { RegisterService } from './providers/register.provider';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailService } from './providers/verify-email.provider';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './providers/login.provider';
import { RefreshTokenService } from './providers/refresh-token.provider';
import { LogoutService } from './providers/logout.provider';
import { AuthResponseInterceptor } from './interceptor/auth-response.interceptor';

@UseInterceptors(AuthResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly loginService: LoginService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Query('token') token: string) {
    return this.verifyEmailService.verify(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.loginService.login(loginDto, response);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() request: Request) {
    return this.refreshTokenService.refresh(request);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.logoutService.logout(request, response);
  }
}

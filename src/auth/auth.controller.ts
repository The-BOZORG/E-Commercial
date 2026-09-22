import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';

import type { Response, Request } from 'express';

import { RegisterService } from './providers/register.provider';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailService } from './providers/verify-email.provider';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './providers/login.provider';
import { RefreshTokenService } from './providers/refresh-token.provider';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly loginService: LoginService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.verifyEmailService.verify(token);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.loginService.login(loginDto, response);
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    return this.refreshTokenService.refresh(request);
  }
}

import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { RegisterService } from './providers/register.provider';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailService } from './providers/verify-email.provider';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly verifyEmailService: VerifyEmailService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.verifyEmailService.verify(token);
  }
}

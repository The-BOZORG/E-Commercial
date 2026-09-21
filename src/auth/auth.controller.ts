import { Body, Controller, Post } from '@nestjs/common';

import { RegisterService } from './providers/register.provider';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }
}

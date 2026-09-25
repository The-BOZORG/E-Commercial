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
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
@ApiTags('Auth')
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully and email verification sent.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email with token' })
  @ApiQuery({
    name: 'token',
    required: true,
    type: String,
    description: 'Verification token sent to the user email',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully.',
  })
  verifyEmail(@Query('token') token: string) {
    return this.verifyEmailService.verify(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and create session' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Login successful. Access token returned and refresh token stored in a cookie.',
  })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.loginService.login(loginDto, response);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access token issued.',
  })
  refresh(@Req() request: Request) {
    return this.refreshTokenService.refresh(request);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and invalidate refresh token session' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful.',
  })
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.logoutService.logout(request, response);
  }
}

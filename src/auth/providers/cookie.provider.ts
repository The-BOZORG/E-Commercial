import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setRefreshToken(response: Response, refreshToken: string): void {
    const cookie = this.configService.getOrThrow('cookie');

    response.cookie(cookie.refreshTokenName, refreshToken, cookie.options);
  }

  getRefreshToken(request: Request): string {
    const cookie = this.configService.getOrThrow('cookie');

    const refreshToken = request.cookies?.[cookie.refreshTokenName];

    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    return refreshToken;
  }

  clearRefreshToken(response: Response): void {
    const cookie = this.configService.getOrThrow('cookie');

    response.clearCookie(cookie.refreshTokenName, cookie.options);
  }
}

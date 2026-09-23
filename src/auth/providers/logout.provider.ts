import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CookieService } from './cookie.provider';
import { TokenService } from './token.provider';
import { SessionService } from './session.provider';
import { RefreshTokenPayload } from '../interface/interface.auth';

@Injectable()
export class LogoutService {
  constructor(
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  public async logout(request: Request, response: Response) {
    const refreshToken = this.cookieService.getRefreshToken(request);

    let payload: RefreshTokenPayload;

    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      this.cookieService.clearRefreshToken(response);

      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      await this.sessionService.deleteSession(payload.sid);
    } catch {
      throw new UnauthorizedException('Failed to logout');
    }

    this.cookieService.clearRefreshToken(response);

    return {
      message: 'Logout successful',
    };
  }
}

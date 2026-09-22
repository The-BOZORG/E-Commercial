import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from './cookie.provider';
import { TokenService } from './token.provider';
import { SessionService } from './session.provider';
import { RefreshTokenPayload } from '../interface/interface.auth';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  public async refresh(request: Request) {
    const refreshToken = this.cookieService.getRefreshToken(request);

    let payload: RefreshTokenPayload;

    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.sessionService.getSession(payload.sid);

    if (!session) throw new UnauthorizedException('Session not found');

    if (session.userId !== payload.sub)
      throw new UnauthorizedException('Invalid session');

    if (session.refreshToken !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const accessToken = this.tokenService.generateAccessToken(payload.sub);

    return {
      accessToken,
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from './cookie.provider';
import { TokenService } from './token.provider';
import { SessionService } from './session.provider';
import { RefreshTokenPayload } from '../interface/interface.auth';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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

    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role,
    );

    return {
      accessToken,
    };
  }
}

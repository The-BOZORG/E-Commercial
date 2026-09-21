import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from '../interface/interface.auth';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(userId: string): string {
    return this.jwtService.sign({
      sub: userId,
    });
  }

  generateRefreshToken(userId: string, sessionId: string): string {
    return this.jwtService.sign(
      {
        sub: userId,
        sid: sessionId,
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow<'7d'>('jwt.refreshExpiration'),
      },
    );
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(token, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
    });
  }
}

import { UserRole } from '../enum/enum.auth';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
}

export interface Session {
  userId: string;
  refreshToken: string;
}

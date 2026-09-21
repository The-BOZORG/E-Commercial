export interface JwtPayload {
  sub: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
}

export interface Session {
  userId: string;
  refreshToken: string;
}

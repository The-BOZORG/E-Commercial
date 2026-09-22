import { registerAs } from '@nestjs/config';

export const cookieConfig = registerAs('cookie', () => ({
  refreshTokenName: 'refresh_token',

  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/v1/auth',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

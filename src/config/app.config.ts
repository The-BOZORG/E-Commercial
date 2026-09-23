import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  appUrl: process.env.APP_URL,

  adminEmails: process.env.ADMIN_EMAILS?.split(',').map((email) =>
    email.trim().toLowerCase(),
  ),
}));

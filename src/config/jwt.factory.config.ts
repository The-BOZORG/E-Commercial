import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.getOrThrow<string>('jwt.accessSecret'),

  signOptions: {
    expiresIn: configService.getOrThrow<'7d'>('jwt.accessExpiration'),
  },
});

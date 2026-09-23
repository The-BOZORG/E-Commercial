import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.factory.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './providers/token.provider';
import { PasswordHashService } from './providers/password-hash.sprovider';
import { EmailVerificationService } from './providers/email-verify.provider';
import { RegisterService } from './providers/register.provider';
import { SessionService } from './providers/session.provider';
import { VerifyEmailService } from './providers/verify-email.provider';
import { LoginService } from './providers/login.provider';
import { CookieService } from './providers/cookie.provider';
import { RefreshTokenService } from './providers/refresh-token.provider';
import { LogoutService } from './providers/logout.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SessionService,
    TokenService,
    PasswordHashService,
    EmailVerificationService,
    RegisterService,
    VerifyEmailService,
    LoginService,
    CookieService,
    RefreshTokenService,
    LogoutService,
  ],
})
export class AuthModule {}

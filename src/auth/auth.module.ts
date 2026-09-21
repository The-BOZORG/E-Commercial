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
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RegisterService } from './providers/register.provider';
import { SessionService } from './providers/session.provider';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SessionService,
    TokenService,
    PasswordHashService,
    EmailVerificationService,
    RegisterService,
  ],
})
export class AuthModule {}

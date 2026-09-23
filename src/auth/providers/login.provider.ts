import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from '../../users/entity/user.entity';
import { Repository } from 'typeorm';
import { PasswordHashService } from './password-hash.sprovider';
import { TokenService } from './token.provider';
import { SessionService } from './session.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from '../dto/login.dto';
import { CookieService } from './cookie.provider';
import { Response } from 'express';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly passwordHashService: PasswordHashService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly cookieService: CookieService,
  ) {}

  public async login(loginDto: LoginDto, response: Response) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.passwordHashService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified)
      throw new UnauthorizedException('Please verify your email first');

    const sessionId = randomUUID();

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role,
    );

    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      sessionId,
    );

    await this.sessionService.createSession(sessionId, user.id, refreshToken);

    this.cookieService.setRefreshToken(response, refreshToken);

    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
}

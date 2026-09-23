import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/entity/user.entity';
import { PasswordHashService } from './password-hash.sprovider';
import { EmailVerificationService } from './email-verify.provider';
import { EmailService } from 'src/mail/mail.service';

import { RegisterDto } from '../dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../enum/enum.auth';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly passwordHashService: PasswordHashService,

    private readonly emailVerificationService: EmailVerificationService,

    private readonly emailService: EmailService,

    private readonly configService: ConfigService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) throw new ConflictException('Email already exists');

    const passwordHash = await this.passwordHashService.hash(
      registerDto.password,
    );

    const adminEmails =
      this.configService.getOrThrow<string[]>('app.adminEmails');

    const role = adminEmails.includes(registerDto.email.trim().toLowerCase())
      ? UserRole.ADMIN
      : UserRole.USER;

    const user = this.userRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: passwordHash,
      role,
      isEmailVerified: false,
    });

    await this.userRepository.save(user);

    const verificationToken = await this.emailVerificationService.createToken(
      user.id,
    );

    const verificationUrl =
      this.configService.getOrThrow<string>('app.appUrl') +
      `/auth/verify-email?token=${verificationToken}`;

    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationUrl,
    );

    return {
      message: 'Registration successful. Verification code sent to your email.',
    };
  }
}

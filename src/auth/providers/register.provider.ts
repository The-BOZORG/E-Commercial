import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { PasswordHashService } from './password-hash.sprovider';
import { EmailVerificationService } from './email-verify.provider';
import { EmailService } from 'src/mail/mail.service';

import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly passwordHashService: PasswordHashService,

    private readonly emailVerificationService: EmailVerificationService,

    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) throw new ConflictException('Email already exists');

    const passwordHash = await this.passwordHashService.hash(
      registerDto.password,
    );

    const user = this.userRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: passwordHash,
      isEmailVerified: false,
    });

    await this.userRepository.save(user);

    const verificationToken = await this.emailVerificationService.createToken(
      user.id,
    );

    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${verificationToken}`;

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

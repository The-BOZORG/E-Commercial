import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { EmailVerificationService } from './email-verify.provider';

@Injectable()
export class VerifyEmailService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async verify(token: string) {
    if (!token) throw new BadRequestException('Verification token is required');

    const userId = await this.emailVerificationService.verifyToken(token);

    if (!userId)
      throw new BadRequestException('Verification token is invalid or expired');

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) {
      return {
        message: 'Email is already verified',
      };
    }

    user.isEmailVerified = true;

    await this.userRepository.save(user);

    return {
      message: 'Email verified successfully',
    };
  }
}

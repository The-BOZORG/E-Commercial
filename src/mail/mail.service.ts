import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}

  async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Email Verification',
      template: 'verification',
      context: {
        code,
      },
    });
  }
}
